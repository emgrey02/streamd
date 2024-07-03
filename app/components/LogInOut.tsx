'use client';

import { useEffect, useState } from 'react';
import { getAccessToken } from '../actions';
import TmdbSignIn from './TmdbSignIn';
import TmdbSignOut from './TmdbSignOut';

export default function LogInOut() {
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        // see if there is an access token cookie
        // if so, someone is logged in
        const setSignedInState = async () => {
            const accToken = await getAccessToken();
            setSignedIn(accToken ? true : false);
        };

        setSignedInState();
    }, []);

    return (
        <>
            {signedIn ?
                <TmdbSignIn rt={rt} />
            :   <TmdbSignOut />}
        </>
    );
}
