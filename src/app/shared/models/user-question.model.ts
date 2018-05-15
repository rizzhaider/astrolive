import { Astrologer } from './astrologer.model';

export class UserQuestion {
	userId: number;
    userImgUrl: string;
    userName: string;
    question: string;
    questionId: number;
    time: string;
    astroList: Astrologer[];
    isActive: boolean;

}