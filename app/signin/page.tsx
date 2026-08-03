'use server';
import SetReqToken from '../components/SetReqToken';
import { getRequestToken } from '../actions/auth';

export default async function SignInPage() {
    const reqToken = await getRequestToken();

    return <SetReqToken rt={reqToken} />;
}
