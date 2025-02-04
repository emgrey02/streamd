'use client';
import { useRouter } from 'next/navigation';

export default function BackButton(props: { main: boolean; link?: string }) {
    const router = useRouter();

    function sendToPage() {
        if (props.main) {
            router.push('/');
        } else if (props.link) {
            router.replace(props.link);
        } else {
            router.back();
        }
    }

    return (
        <button
            className="py-2 px-2 flex items-center hover:bg-slate-400/40 transition w-fit focus:outline-none focus:ring focus:ring-brand-blue"
            onClick={sendToPage}
        >
            <svg
                fill="#ffffff"
                width="20px"
                height="20px"
                viewBox="-8.5 2 32 32"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>back</title>
                <path d="M15.281 7.188v17.594l-15.281-8.781z"></path>
            </svg>
            <span className="text-lg">Back {props.main ? 'to Main' : ''}</span>
        </button>
    );
}
