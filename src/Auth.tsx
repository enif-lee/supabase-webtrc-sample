import { createClient } from '@supabase/supabase-js';
import React from 'react';

const supabase = createClient(
  'https://aqquavrzsoekswmysfsl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDk3OTY0MCwiZXhwIjoxOTQwNTU1NjQwfQ.glKMPY33SD0qu0H2_NmmuZubGi-sMBaDMYlVLgsRqZs',
);

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.testClick = this.testClick.bind(this);
  }

  async testClick() {
    let { user, error } = await supabase.auth.signUp({
      email: this.state.email,
      password: this.state.password,
    });

    if (error) {
      console.log('error', error);
      alert(`회원가입 실패! ${error.message}`);
      return;
    }

    console.log('user', user);
    alert('회원가입 성공! 인증 이메일이 발송되었습니다');
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    return (
      <div>
        <div>Auth</div>

        <div>
          <input
            id="email"
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            id="password"
            type="text"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>

        <div>
          <button onClick={this.testClick}>가입 테스트</button>
        </div>
      </div>
    );
  }
}

export default Auth;
