import axios from "axios";
import useSWRMutation from "swr/mutation";


type LoginUserPayload = { uName: string; pwd: string };
type LoginUserResponse = { id: number; username: string };

export default function useLoginUser() {
    return useSWRMutation<
        LoginUserResponse,
        Error,
        "/login",
        LoginUserPayload
    >(
        "/login",
        async (_url, { arg: { uName, pwd } }) => {
            const res = await axios.post<LoginUserResponse>(
                "http://localhost:5000/login/",
                { username: uName, password: pwd },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}