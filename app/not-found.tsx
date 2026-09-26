import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-6xl font-extrabold text-brand-accent">404</h1>
            <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
            <p className="mt-2 text-brand-text max-w-md">
                The page or discussion you are looking for doesn't exist or has been moved.
            </p>
            <Button className="mt-6 bg-brand-accent hover:bg-brand-accent/80 text-white">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    );
}