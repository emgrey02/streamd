'use server';
import SetReqToken from '../components/SetReqToken';
import { getRequestToken } from '../actions';

export default async function SignInPage() {
    const reqToken = await getRequestToken();

    return <SetReqToken rt={reqToken} />;
}
