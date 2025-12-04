import useSWRMutation from "swr/mutation";
import axios from "axios";

type AnswerCheckerPayload = { question: string, answer: string, response: string };
type AnswerCheckerResponse = { is_match: boolean, similarity_score: number, reasoning: string };

export default function useAnswerChecker() {
    return useSWRMutation<
        AnswerCheckerResponse,
        Error,
        "/answer_checker",
        AnswerCheckerPayload
    >(
        "/answer_checker",
        async (_url, { arg: { question, answer, response } }) => {
            const res = await axios.post<AnswerCheckerResponse>(
                `http://localhost:5000/answer_checker/`,
                { question: question, answer: answer, response: response },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}