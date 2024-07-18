'use client';

import { getPersonInfo } from '@/app/actions';
import ContentPageNav from '@/app/components/ContentPageNav';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Person({ params }: { params: { id: string } }) {
    const personId = params.id;
    const [content, setContent] = useState<any>();
    const [contentTitle, setContentTitle] = useState('info');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveContent() {
            let result = await getPersonInfo(personId);
            console.log(result);
            setContent(result);
        }

        retrieveContent();
        setTimeout(() => setIsLoading(false), 500);
    }, [personId, contentTitle]);

    // const genders = ['not specified', 'female', 'male', 'non-binary'];

    // function getDate(birthday: string) {
    //     console.log(birthday);
    //     let birthArray = birthday.split('-');
    //     let months = [
    //         'January',
    //         'February',
    //         'March',
    //         'April',
    //         'May',
    //         'June',
    //         'July',
    //         'August',
    //         'September',
    //         'October',
    //         'November',
    //         'December',
    //     ];
    //     let month = months[+birthArray[1] - 1];
    //     return `${month} ${birthArray[2]}, ${birthArray[0]}`;
    // }

    // function getAge(birthdate: Date) {
    //     const today = new Date();

    //     const age =
    //         today.getFullYear() -
    //         birthdate.getFullYear() -
    //         (+(today.getMonth() < birthdate.getMonth()) ||
    //             +(
    //                 today.getMonth() === birthdate.getMonth() &&
    //                 today.getDate() < birthdate.getDate()
    //             ));
    //     return age;
    // }

    function setIt(cont: any) {
        setIsLoading(true);
        console.log('setting it');
        if (cont === 'info') {
            setContentTitle('info');
        } else if (cont === 'credits') {
            setContentTitle('credits');
        } else {
            setContentTitle('reviews');
        }
    }

    return (
        <main className="m-4">
            <ContentPageNav
                setIt={setIt}
                currentTitle={contentTitle}
                person={true}
            />
            {isLoading && <p>loading...</p>}
            {contentTitle === 'info' && content && !isLoading && (
                <SmallCreditsList
                    setIt={setIt}
                    creds={content.combined_credits}
                    cont="multi"
                    personId={personId}
                />
            )}
            {contentTitle === 'credits' &&
                content.combined_credits &&
                !isLoading && (
                    <>
                        <div id="cast" className="flex flex-col mb-8">
                            <h1 className="text-xl font-bold">Cast Credits</h1>
                            <Link
                                href="#crew"
                                className="text-sm hover:underline underline-offset-2"
                            >
                                Skip to Crew Credits
                            </Link>
                        </div>
                        <LargeCreditsList
                            data={content.combined_credits.cast}
                            type="multi"
                            search={false}
                            credits={true}
                            fwr={false}
                            seasons={false}
                        />
                        <div id="crew" className="flex flex-col mb-8">
                            <h2 className="text-xl font-bold">Crew Credits</h2>
                            <Link
                                href="#cast"
                                className="text-sm hover:underline underline-offset-2"
                            >
                                Back to Cast Credits
                            </Link>
                        </div>
                        <LargeCreditsList
                            data={content.combined_credits.crew}
                            type="multi"
                            search={false}
                            credits={true}
                            fwr={false}
                            seasons={false}
                        />
                    </>
                )}
        </main>
    );
}
