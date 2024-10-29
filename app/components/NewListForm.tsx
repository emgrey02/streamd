import { useState } from 'react';
import { createList } from '../actions';

export default function NewListForm(props: { at: string; updateLists: any }) {
    const [showForm, setShowForm] = useState<boolean>(false);

    const createListWithAccessToken = createList.bind(null, props.at);

    return (
        <div className="flex flex-col gap-2 items-start">
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Close' : 'Create List'}
            </button>
            {showForm && (
                <form
                    action={createListWithAccessToken}
                    className={`${!showForm ? 'hidden' : 'flex'} flex-col gap-4 w-full bg-slate-900 px-3 py-2`}
                >
                    <div className="flex flex-col">
                        <label htmlFor="list-name">Name</label>
                        <input
                            type="text"
                            name="list name"
                            id="list-name"
                            className="text-slate-800 px-2 py-1 bg-slate-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="list-name">Description</label>
                        <textarea
                            name="list description"
                            id="list-desc"
                            rows={10}
                            className="text-slate-800 px-2 py-1 bg-slate-300"
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="checkbox"
                            name="public toggle"
                            id="public-toggle"
                        />
                        <label htmlFor="public-toggle">Make Public?</label>
                    </div>
                    <button
                        type="submit"
                        onClick={props.updateLists}
                        className="bg-slate-700 py-2 hover:bg-slate-800 transition"
                    >
                        Create List
                    </button>
                </form>
            )}
        </div>
    );
}
