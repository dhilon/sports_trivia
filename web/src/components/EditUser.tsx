import useSWRMutation from "swr/mutation";
import axios from "axios";

type CreateUserPayload = { uName: string; pwd: string; scores: { [key: string]: number }; friends: string[], profile_picture: string }
type CreateUserResponse = { id: number; username: string }

/** 2) Mutation hook using axios */
export default function useEditUser() {
    return useSWRMutation<
        CreateUserResponse,     // return type from the mutation
        Error,                  // error type
        '/users',               // key type
        CreateUserPayload       // your arg type
    >(
        '/users',
        async (_url, { arg: { uName, pwd, scores, friends, profile_picture } }) => {
            const res = await axios.post<CreateUserResponse>('http://localhost:5000/users/' + uName + "/", {
                username: uName,
                password: pwd,
                scores: scores,
                friends: friends,
                profile_picture: profile_picture,
            })
            return res.data
        }
    )
}