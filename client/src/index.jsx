import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress } from './utils'
import screenshot from './screenshot.png'
import DetailComponent from './components/DetailComponent'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      email: '',
      username: '',
      code: '',
      verified: false,
      nameVerified: false,
      verifyNameTip: '',
      loadingCount: 0,
      created: false
    }

    this.onUserNameChange = this.onUserNameChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  verifyCodeTip () {
    const { verified, loadingCount } = this.state
    if (verified) {
      return '✓ 账号验证成功'
    } else if (loadingCount > 0) {
      return '验证中' + '.'.repeat(loadingCount % 4)
    } else {
      return ''
    }
  }

  componentDidMount () {
  }

  async onUserNameChange (evt) {
    const username = evt.target.value

    this.setState({ verifyNameTip: '正在验证用户名' })
    const { valid, code } = await api.isValidUser({ username })
    if (valid) {
      this.setState({
        nameVerified: true,
        verifyNameTip: '✓ 账号有效',
        code
      })
    } else {
      this.setState({ verifyNameTip: '无效的用户名' })
    }
  }

  async verifyCode () {
    const { username, code } = this.state
    this.setState({ loadingCount: this.state.loadingCount + 1 })
    const verified = await api.verify({ username, code })
    this.setState({ verified })
    if (!verified) {
      await this.verifyCode()
    } else {
      this.setState({
        loadingTip: '账号验证成功',
        loadingCount: 0
      })
    }
  }

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
    }
  }

  async handleSubmit () {
    const { username, email, code } = this.state
    await this.verifyCode()
    const created = await api.submit({ username, email, code })
    this.setState({ created })
  }

  render () {
    const {
      code,
      email,
      nameVerified,
      verifyNameTip,
      created
    } = this.state

    const enableSubmit = email.length > 0 && code.length > 0
    if (created) {
      return (
        <DetailComponent />
      )
    }

    return (
      <div className={styles.MainContainer}>
        <h2 className={styles.CenterText}>小对话</h2>
        <h4 className={styles.CenterText}>轻松拓展你的朋友圈</h4>
        <div className={styles.FormContainer}>
          <p>1. 输入你的 V2EX 用户名</p>
          <input
            placeholder='用户名'
            type='text'
            className={styles.UserNameInput}
            onChange={this.onUserNameChange}
            />
          <p className={nameVerified ? styles.PassText : styles.ErrorText}>{verifyNameTip}</p>
          <p className={nameVerified ? '' : styles.InactiveText} >
                2. 输入你的邮箱
            </p>
          <input
            placeholder='email'
            type='email'
            disabled={!nameVerified}
            className={styles.EmailInput}
            onChange={this.onEmailChange}
            />
          <p className={nameVerified && !!email ? '' : styles.InactiveText} >
                3. 把下面的验证码添加到 V2EX 个人简介 (?)
            </p>
          <input
            placeholder='自动生成验证码'
            type='text'
            disabled={!nameVerified || !email}
            className={styles.CodeInput}
            value={code}
            />
          <p> {this.verifyCodeTip()}</p>
          <button
            type='button'
            disabled={!enableSubmit}
            onClick={this.handleSubmit}
            className={(!nameVerified || !email) ? styles.SubmitBtn + ' ' + styles.BtnDisable : styles.SubmitBtn}
            > 注册
            </button>
        </div>
        <div className={styles.introContainer}>
          <p className={styles.CenterText}>· · ·</p>
          <h4 className={styles.CenterText}>How does it work?</h4>
          <p>小对话每天为你匹配一位 V2EX 好友，然后发送一封包括他个人介绍的邮件到你的邮箱。</p>
          <p className={styles.CenterText}>· · ·</p>
          <img className={styles.Screenshot} src={screenshot} />
        </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
