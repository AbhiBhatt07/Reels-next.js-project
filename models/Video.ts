import mongoose, {Schema, models, model} from 'mongoose';
import {IUser} from "@/models/User";

export const VIDEO_DIMENSTIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number,
        width: number,
        quality?: number
    }
    createdAt?: Date;
    updatedAt?: Date;
}

const VideoSchema = new Schema<IVideo>({
    title:{type: 'String', required: true},
    description:{type: 'String', required: true},
    videoUrl:{type: 'String', required: true},
    thumbnailUrl:{type: 'String', required: true},
    controls:{type: 'boolean', default: true},
    transformation: {
        height: {type: 'Number', default: VIDEO_DIMENSTIONS.height},
        width: {type: 'Number', default: VIDEO_DIMENSTIONS.width},
    },
    createdAt: {type: 'Date'},
    updateAt: {type: 'Date'},
},{timestamps: true})


const Video = models?.Video || model<IVideo>('Video', VideoSchema);

export default Video;
