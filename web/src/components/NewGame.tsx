import useSWRMutation from "swr/mutation";
import axios from "axios";

type CreateGamePayload = { type: string; sport: string };
type CreateGameResponse = { id: number };

export default function useNewGame() {
    return useSWRMutation<
        CreateGameResponse,
        Error,
        "/games",
        CreateGamePayload
    >(
        "/games",
        async (_url, { arg: { type, sport } }) => {
            const res = await axios.post<CreateGameResponse>(
                "http://localhost:5000/games/",
                { type: type, sport: sport },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}