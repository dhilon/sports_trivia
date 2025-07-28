import useSWRMutation from "swr/mutation";
import axios from "axios";

type CreateGamePayload = { id: number, status: string, time: number, score: number, current_question: number };
type CreateGameResponse = { id: number, sport: string, type: string, };

export default function useCreateGame() {
    return useSWRMutation<
        CreateGameResponse,
        Error,
        "/games",
        CreateGamePayload
    >(
        "/games",
        async (_url, { arg: { id, status, time, score, current_question } }) => {
            const res = await axios.post<CreateGameResponse>(
                `http://localhost:5000/games/${id}`,
                { id: id, status: status, time: time, score: score, current_question: current_question },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}