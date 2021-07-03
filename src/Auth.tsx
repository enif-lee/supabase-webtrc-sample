// import { createClient } from '@supabase/supabase-js';
import React, { useCallback } from 'react';

// const supabase = createClient(
//   'https://aqquavrzsoekswmysfsl.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDk3OTY0MCwiZXhwIjoxOTQwNTU1NjQwfQ.glKMPY33SD0qu0H2_NmmuZubGi-sMBaDMYlVLgsRqZs',
// );

function Auth() {
  // const { loading, value } = useAsync(async () => {
  //   const { error, body } = await supabase.from('chats').select();
  //   if (error) throw error;
  //   return body;
  // });

  const testClick = useCallback(async () => {
    // await supabase
    //   .from('chats')
    //   .update({
    //     answer: {
    //       type: answerDescription.type,
    //       sdp: answerDescription.sdp,
    //     },
    //   })
    //   .match({ id: 1 });
  }, []);

  // useLayoutEffect(() => {
  //   fetch();
  // }, []);

  return (
    <div>
      <div>Auth</div>

      <div>
        <button onClick={testClick}>로그인테스트</button>
      </div>
    </div>
  );
}

export default Auth;
