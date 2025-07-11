import useSWRMutation from "swr/mutation";
import axios from "axios";

type CreateGamePayload = { id: number, status: string, time: number, score: number };
type CreateGameResponse = { id: number, sport: string, type: string, };

export default function useCreateGame() {
    return useSWRMutation<
        CreateGameResponse,
        Error,
        "/games",
        CreateGamePayload
    >(
        "/games",
        async (_url, { arg: { id, status, time, score } }) => {
            const res = await axios.post<CreateGameResponse>(
                `http://localhost:5000/games/${id}`,
                { id: id, status: status, time: time, score: score },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}