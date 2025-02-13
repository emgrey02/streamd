import { useEffect, useState } from 'react';
import { createList, updateList } from '../actions';

export default function NewListForm(props: {
    at: string;
    updateLists: any;
    edit: boolean;
    data?: any;
}) {
    const [showForm, setShowForm] = useState<boolean>(false);
    let data = props.data;

    console.log(props.edit);
    console.log(data);

    const formAction = async (formData: FormData) => {
        if (!props.edit) {
            await createList(props.at, formData);
        } else {
            await updateList(props.at, data.id, formData);
        }
        setShowForm(false);
        props.updateLists();
    };

    const handleFormOpenClose = () => {
        setShowForm(!showForm);
        if (props.edit) {
            props.updateLists();
        }
    };

    useEffect(() => {
        if (props.edit) {
            setShowForm(true);
        }
    }, [props.edit]);

    return (
        <div className="flex flex-col gap-2 items-start">
            <button
                onClick={handleFormOpenClose}
                className="bg-slate-700 hover:bg-slate-900 transition border-2 border-slate-900 text-brand-blue px-4 py-2"
            >
                {showForm ? 'Close' : 'Create List'}
            </button>
            {showForm && (
                <form
                    action={formAction}
                    className={`${!showForm ? 'hidden' : 'flex'} flex-col gap-4 w-full bg-slate-900 px-3 py-2`}
                >
                    <div className="flex flex-col">
                        <label htmlFor="list-name">Name</label>
                        <input
                            type="text"
                            name="list name"
                            id="list-name"
                            defaultValue={props.data.name || ''}
                            className="text-slate-800 px-2 py-1 bg-slate-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="list-name">Description</label>
                        <textarea
                            name="list description"
                            id="list-desc"
                            rows={10}
                            defaultValue={props.data.desc || ''}
                            className="text-slate-800 px-2 py-1 bg-slate-400"
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="checkbox"
                            name="public toggle"
                            id="public-toggle"
                            defaultValue={props.data.pub || false}
                        />
                        <label htmlFor="public-toggle" className="">
                            Make Public?
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-slate-700 py-2 hover:bg-slate-800 transition"
                    >
                        {!props.edit ? 'Create List' : 'Update List'}
                    </button>
                </form>
            )}
        </div>
    );
}
