import * as Player from "@livepeer/react/player";

export default function StreamPlayer({ src }: { src: any }) {
  if (!src) {
    return <div>No stream available.</div>;
  }

  return (
    <Player.Root src={src}>
      <Player.Container className="aspect-video bg-black rounded-lg overflow-hidden">
        <Player.Video className="w-full h-full" />
        <Player.LoadingIndicator>
          <div>Loading...</div>
        </Player.LoadingIndicator>
        <Player.ErrorIndicator matcher={() => true}>
          <div>Error loading stream.</div>
        </Player.ErrorIndicator>
        <Player.Controls>
          <Player.PlayPauseTrigger />
          <Player.MuteTrigger />
          <Player.FullscreenTrigger />
          {/* Add more controls as needed */}
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
}