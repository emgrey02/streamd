'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            className="my-4 py-2 flex items-center h-20"
            onClick={() => router.back()}
        >
            <svg
                fill="#ffffff"
                width="30px"
                height="30px"
                viewBox="-8.5 2 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>back</title>
                <path d="M15.281 7.188v17.594l-15.281-8.781z"></path>
            </svg>
            <p className="text-xl/3">Back</p>
        </button>
    );
}
