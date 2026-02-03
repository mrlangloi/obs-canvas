const TwitchEmbed = () => {
    return (
        <div id="twitch-embed">
            <iframe src={`https://player.twitch.tv/?channel=dearbun&parent=localhost`}
                className="streamer-mode"
                title="Twitch Embed"
                width="1280"
                height="720"
            />
        </div>
    )
}

export default TwitchEmbed