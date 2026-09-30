"use server";
import { BookmarkPostFields, CreateCommentFields, CreatePostFields, EditCommentFields, FeedType, FetchCommentsFromPostFields, FetchPostFields, GetPostByIdFields, LikePostFields, PostUserActionFields, PostWithRelations } from "@/lib/types";
import prisma from "@/lib/prisma";
import { Post } from "@/lib/generated/prisma/client";
import createCommentSchema from "@/schemas/createCommentSchema";

export async function createPost(data: CreatePostFields) {
    const user = await prisma.user.findUnique({
        where: { clerkId: data.userClerkId }
    });
    if (!user) {
        throw new Error("USER DOES NOT EXIST!")
    }

    const post = await prisma.post.create({
        data: data
    });

    console.log("POST CREATED: ", post);
}
export async function fetchPosts({ page, limit, filters, currentUserId }: FetchPostFields) {
    const feedType: FeedType = filters?.feed ?? "latest"
    if (feedType === "viewed") {
        if (!currentUserId) {
            return { posts: [], nextPage: null };
        }

        try {
            const viewedEntries = await prisma.viewedPost.findMany({
                skip: (page - 1) * limit,
                take: limit + 1,
                orderBy: { createdAt: 'desc' }, // Sorts by latest view timestamp
                where: { userClerkId: currentUserId },
                include: {
                    post: {
                        include: {
                            _count: { select: { likes: true, comments: true } },
                            likes: currentUserId ? {
                                where: { userClerkId: currentUserId },
                                select: { userClerkId: true }
                            } : false,
                            user: { select: { username: true } },
                            bookmarks: currentUserId ? {
                                where: { userClerkId: currentUserId },
                                select: { userClerkId: true }
                            } : false,
                        }
                    }
                }
            });

            const hasMore = viewedEntries.length > limit;
            if (hasMore) {
                viewedEntries.pop();
            }

            const formattedPosts = viewedEntries.map((entry) => {
                const post = entry.post;
                return {
                    ...post,
                    isLiked: post.likes ? post.likes.length > 0 : false,
                    likesCount: post._count.likes,
                    commentsCount: post._count.comments,
                    likes: undefined,
                    _count: undefined,
                    username: post.user.username,
                    isBookMarked: post.bookmarks ? post.bookmarks.length > 0 : false
                };
            });

            const nextPage = hasMore ? page + 1 : null;
            return { posts: formattedPosts, nextPage };
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    let orderByClause: any = { createdAt: 'desc' };
    let whereClause: any = {}
    if (feedType == "popular") {
        orderByClause = { likes: { _count: "desc" } }
    }
    else if (feedType == "explore") {
        orderByClause = { comments: { _count: 'desc' } };
    }

    if (filters?.clerkId) { whereClause.userClerkId = filters?.clerkId }
    if (filters?.postId) { whereClause.id = filters?.postId };
    if (filters?.feed == "bookmarked") {
        if (!currentUserId) {
            return { posts: [], nextPage: null }
        }
        whereClause.bookmarks = {
            some: { userClerkId: currentUserId }
        }
    }
    // else if (filters?.feed == "viewed") {
    //     if (!currentUserId) {
    //         return { posts: [], nextPage: null }
    //     }
    //     whereClause.viewedPosts = {
    //         some: { userClerkId: currentUserId }
    //     }
    // }
    try {
        const posts = await prisma.post.findMany({
            skip: (page - 1) * limit,
            take: limit + 1,
            orderBy: orderByClause,
            where: whereClause,
            include: {
                _count: {
                    select: { likes: true, comments: true }

                },
                likes: currentUserId ? {
                    where:
                        { userClerkId: currentUserId }, select: { userClerkId: true }
                } : false,
                user: { select: { username: true } },
                bookmarks: currentUserId ? {
                    where: { userClerkId: currentUserId }, select: { userClerkId: true }
                } : false,

            }
        });
        const hasMore = posts.length > limit;

        const formattedPosts = posts.map((post) => ({
            ...post,
            isLiked: post.likes ? post.likes.length > 0 : false,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            likes: undefined,
            _count: undefined,
            username: post.user.username,
            isBookMarked: post.bookmarks ? post.bookmarks.length > 0 : false
        }));

        if (hasMore) {
            posts.pop();
        }

        const nextPage = hasMore ? page + 1 : null;

        return { posts: formattedPosts, nextPage }
    }
    catch (err) {
        throw new Error((err as Error).message)
    }

}

export async function likePost({ clerkId, postId }: LikePostFields) {
    if (!clerkId || !postId) {
        throw new Error(`CLERK ID OR POST ID NULL! ${clerkId} , ${postId}`)
    }
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userClerkId_postId: {
                    userClerkId: clerkId,
                    postId: postId,
                }
            }
        });
        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userClerkId_postId: {
                        userClerkId: clerkId,
                        postId: postId,
                    }
                }
            });
            return { isLiked: false }
        }

        const like = await prisma.like.create({
            data: {
                userClerkId: clerkId,
                postId: postId
            }
        });

        return { isLiked: true }
    }
    catch (err) {
        throw new Error((err as Error).message)
    }

}

export async function getPostById({ currentUserId, postId }: GetPostByIdFields) {
    if (!postId) {
        throw new Error(`USERID OR POSTID NULL IN getPostById! ${currentUserId} ${postId}`)
    }
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            _count: {
                select: { likes: true, comments: true }
            },
            likes: currentUserId ? { where: { userClerkId: currentUserId }, select: { userClerkId: true } } : false,
            user: { select: { username: true } },
            bookmarks: currentUserId ? { where: { userClerkId: currentUserId }, select: { userClerkId: true } } : false
        }
    });

    const formattedPost = {
        ...post,
        likesCount: post?._count.likes,
        commentsCount: post?._count.comments,
        isLiked: post?.likes ? post.likes.length > 0 : false,
        _count: undefined,
        likes: undefined,
        username: post?.user.username,
        isBookMarked: post?.bookmarks ? post.bookmarks.length > 0 : false,
    };

    return formattedPost;
}

export async function createComment(data: CreateCommentFields) {
    try {
        const parsed = createCommentSchema.safeParse(data);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }

        const { postId, clerkId, text } = parsed.data

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) { throw new Error(`POST DOES NOT EXIST! ${postId}`) }

        const comment = await prisma.comment.create({
            data: {
                userClerkId: clerkId,
                postId: postId,
                text: text
            }
        });
    }
    catch (err) {
        throw new Error((err as Error).message)
    }
}

export async function fetchCommentsFromPost({ page, limit, postId, userId }: FetchCommentsFromPostFields) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: postId },
            skip: (page - 1) * limit,
            take: limit + 1,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: { clerkId: true, username: true }
                }
            }

        });

        const hasMore = comments.length > limit
        if (hasMore) {
            comments.pop()
        }

        const nextPage = hasMore ? page + 1 : null

        const formattedComments = comments.map((comment) => ({
            ...comment,
            username: comment.user.username,
            isByUser: comment.user.clerkId == userId,
            user: undefined

        }));

        return { comments: formattedComments, nextPage }

    }
    catch (e) {
        throw new Error((e as Error).message)
    }
}
export async function editComment({ clerkId, commentId, text }: EditCommentFields): Promise<void> {
    if (!clerkId || !commentId) {
        throw new Error(`Clerk Id Or Comment Id Is Null! ClerkId:${clerkId} CommentId:${commentId}`)
    };
    const comment = await prisma.comment.findUnique({ where: { id: commentId, userClerkId: clerkId } })
    if (!comment) {
        throw new Error(`Comment Not Found! ClerkId:${clerkId} CommentId:${commentId}`)
    }
    await prisma.comment.update({
        where: { id: comment.id },
        data: {
            text: text
        }
    });
}

export async function toggleBookmark({ clerkId, postId }: BookmarkPostFields) {
    if (!clerkId || !postId) {
        throw new Error(`CLERK ID OR POST ID NULL! ${clerkId}, ${postId}`);
    }

    try {
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userClerkId_postId: { userClerkId: clerkId, postId }
            }
        });

        if (existingBookmark) {
            await prisma.bookmark.delete({
                where: {
                    userClerkId_postId: { userClerkId: clerkId, postId }
                }
            });
            return { isBookmarked: false };
        }

        await prisma.bookmark.create({
            data: { userClerkId: clerkId, postId }
        });

        return { isBookmarked: true };
    } catch (err) {
        throw new Error((err as Error).message);
    }
}
export async function addToViewedPosts({ clerkId, postId }: PostUserActionFields) {
    if (!clerkId || !postId) {
        throw new Error(`CLERK ID OR POST ID NULL! ${clerkId}, ${postId}`);
    }

    try {
        // Ensure the User record exists before referencing userClerkId
        // Replace 'user' with proper values if available, or fetch from Clerk SDK on the server
        await prisma.user.upsert({
            where: { clerkId },
            update: {},
            create: {
                clerkId,
                email: `${clerkId}@placeholder.com`, // Adjust to your user's email flow
                username: `user_${clerkId.slice(-6)}`,
            },
        });

        const saved = await prisma.viewedPost.upsert({
            where: {
                userClerkId_postId: { userClerkId: clerkId, postId }
            },
            update: {
                createdAt: new Date()
            },
            create: {
                userClerkId: clerkId,
                postId: postId
            }
        });

        return { success: true, saved };
    } catch (err) {
        throw new Error((err as Error).message);
    }
}