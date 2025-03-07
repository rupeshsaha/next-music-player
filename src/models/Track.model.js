import mongoose from "mongoose"
const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String
    },
    audioUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    genre: {
        type: String
    }
}, { timestamps: true })

const Track = mongoose.models.Track || mongoose.model("Track", trackSchema)
export default Track