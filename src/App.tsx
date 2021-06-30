import './App.css';

import { createClient } from '@supabase/supabase-js';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useAsync, useAsyncFn } from 'react-use';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const supabase = createClient(
  'https://aqquavrzsoekswmysfsl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDk3OTY0MCwiZXhwIjoxOTQwNTU1NjQwfQ.glKMPY33SD0qu0H2_NmmuZubGi-sMBaDMYlVLgsRqZs',
);

function App() {
  const { loading, value } = useAsync(async () => {
    const { error, body } = await supabase.from('chats').select();
    if (error) throw error;
    return body;
  });

  const connection = useMemo(() => new RTCPeerConnection(servers), []);
  const remoteStream = useMemo(() => new MediaStream(), []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<HTMLVideoElement>(null);

  const [, fetch] = useAsyncFn(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    videoRef.current!.srcObject = stream;
    connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    peerRef.current!.srcObject = remoteStream;
  }, []);

  const createChat = useCallback(async () => {
    // const { data, error } = await supabase.from('chats').select().eq('id', 1).limit(1);
    connection.onicecandidate = (event) =>
      event.candidate &&
      supabase
        .from('chats')
        .update({
          offerCandidate: event.candidate.toJSON(),
        })
        .match({ id: 1 });

    const offerDescription = await connection.createOffer();
    await connection.setLocalDescription(offerDescription);

    await supabase
      .from('chats')
      .update({
        offer: {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        },
      })
      .match({ id: 1 });

    console.log(offerDescription);

    supabase
      .from('chats:id=eq.1')
      .on('*', (payload) => {
        console.log('update event', payload);
        if (!connection.currentRemoteDescription && payload.new.answer) {
          connection.setRemoteDescription(new RTCSessionDescription(payload.new.answer));
        }

        if (payload.new.answerCandidate) {
          connection.addIceCandidate(new RTCIceCandidate(payload.new.answerCandidate));
        }
      })
      .subscribe();
  }, []);

  const joinChat = useCallback(async () => {
    connection.onicecandidate = (event) => {
      event.candidate &&
        supabase
          .from('chats')
          .update({
            answerCandidate: event.candidate.toJSON(),
          })
          .match({ id: 1 });
    };

    const { data } = await supabase.from('chats').select().eq('id', 1).limit(1);
    console.log('chat', data);

    const offerDescription = data![0].offer;
    await connection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    console.log('set remoted');
    const answerDescription = await connection.createAnswer();
    await connection.setLocalDescription(answerDescription);

    console.log('set local description', answerDescription);
    await supabase
      .from('chats')
      .update({
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      })
      .match({ id: 1 });

    supabase
      .from('chats:id=eq.1')
      .on('*', (payload) => {
        console.log('update event', payload);
        if (payload.new.offerCandidate) {
          connection.addIceCandidate(new RTCIceCandidate(payload.new.offerCandidate));
        }
      })
      .subscribe();
  }, []);

  useLayoutEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <div>{loading ? 'loading' : 'loaded'}</div>
      <div>{JSON.stringify(value)}</div>

      <div>
        <div>
          <video ref={videoRef} autoPlay />
          <video ref={peerRef} autoPlay />
        </div>
        <button onClick={createChat}>생성</button>
        <button onClick={joinChat}>입장</button>
      </div>
    </div>
  );
}

export default App;
