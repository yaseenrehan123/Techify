import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function NotFoundContent() {
    return (
        <div>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>
                The page or discussion you are looking for doesn't exist or has been moved.
            </p>
            <Button>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    );
}

export default function NotFound() {
    return (
        <Suspense>
            <NotFoundContent />
        </Suspense>
    );
}