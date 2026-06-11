const TwitchEmbed = () => {
    const embedParent = import.meta.env.VITE_TWITCH_EMBED_PARENT

    return (
        <div id="twitch-embed">
            <iframe src={`https://player.twitch.tv/?channel=dearbun&parent=${embedParent}`}
                className="streamer-mode"
                title="Twitch Embed"
                width="1280"
                height="720"
            />
        </div>
    )
}

export default TwitchEmbed