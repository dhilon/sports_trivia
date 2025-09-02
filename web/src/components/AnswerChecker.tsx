import useSWRMutation from "swr/mutation";
import axios from "axios";

type AnswerCheckerPayload = { question: string, answer: string };
type AnswerCheckerResponse = string;

export default function useAnswerChecker() {
    return useSWRMutation<
        AnswerCheckerResponse,
        Error,
        "/answer_checker",
        AnswerCheckerPayload
    >(
        "/answer_checker",
        async (_url, { arg: { question, answer } }) => {
            const res = await axios.post<AnswerCheckerResponse>(
                `http://localhost:5000/answer_checker/`,
                { question: question, answer: answer },
                { withCredentials: true }
            );
            return res.data;
        }
    );
}