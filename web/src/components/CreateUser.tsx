import useSWRMutation from "swr/mutation";
import axios from "axios";

type CreateUserPayload = { uName: string; pwd: string }
type CreateUserResponse = { id: number; username: string }

/** 2) Mutation hook using axios */
export default function useCreateUser() {
    return useSWRMutation<
        CreateUserResponse,     // return type from the mutation
        Error,                  // error type
        '/users',               // key type
        CreateUserPayload       // your arg type
    >(
        '/users',
        async (_url, { arg: { uName, pwd } }) => {
            const res = await axios.post<CreateUserResponse>('http://localhost:5000/users/', {
                username: uName,
                password: pwd,
            })
            return res.data
        }
    )
}