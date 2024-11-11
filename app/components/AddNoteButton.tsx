'use client';

import { useState } from 'react';
import { addNote } from '../actions';

export default function AddNoteButton(props: {
    at: string;
    listId: string;
    mt: string;
    mi: number;
}) {
    const [showForm, setShowForm] = useState(false);

    const addNoteWithInfo = async (formData: FormData) => {
        console.log('adding comment');
        await addNote(props.at, props.listId, props.mt, props.mi, formData);
        setShowForm(false);
    };

    return (
        <div className="flex flex-row p-2 w-full items-start justify-end">
            {showForm && (
                <form
                    action={addNoteWithInfo}
                    className="flex flex-col bottom py-2 px-3 w-full bg-slate-900 z-50 gap-2"
                >
                    <label htmlFor="note">Thoughts?</label>
                    <textarea
                        className="bg-slate-400 text-slate-900 px-2 py-1 focus:outline-none  focus:ring-slate-200 focus:ring-2"
                        name="note"
                        id="note"
                        rows={3}
                    ></textarea>
                    <button
                        className="text-start py-2 bg-slate-700 w-fit px-4 hover:bg-brand-blue hover:text-slate-900 transition focus:"
                        type="submit"
                    >
                        Add Note
                    </button>
                </form>
            )}
            <button onClick={() => setShowForm(!showForm)} className="">
                <svg
                    className={`fill-slate-400 hover:fill-slate-300 ${showForm && 'rotate-45'} transition`}
                    width="25px"
                    height="25px"
                    viewBox="0 0 512 512"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Add/Edit Note</title>
                    <g id="Page-1" strokeWidth="1" fillRule="evenodd">
                        <g
                            id="uncollapse"
                            transform="translate(64.000000, 64.000000)"
                        >
                            <path d="M213.333333,1.42108547e-14 L213.333,170.666 L384,170.666667 L384,213.333333 L213.333,213.333 L213.333333,384 L170.666667,384 L170.666,213.333 L1.42108547e-14,213.333333 L1.42108547e-14,170.666667 L170.666,170.666 L170.666667,1.42108547e-14 L213.333333,1.42108547e-14 Z"></path>
                        </g>
                    </g>
                </svg>
            </button>
        </div>
    );
}
