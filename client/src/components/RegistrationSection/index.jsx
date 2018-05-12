import React from 'react'
import ClipboardJS from 'clipboard'

import styles from './styles.css'
import api from '../../api'
import { maybeEmailAddress } from '../../utils'
import screenshot from './clip.svg'

import { SubmitStatus } from '../../constants'
import SubmitButton from '../SubmitButton'
import InputRow from '../InputRow'

import TitleBox from '../TitleBox'

const Indicator = ({ username, site }) => {
  const urls = {
    'v2ex': 'https://www.v2ex.com/settings',
    'github': 'https://github.com/metrue/asmalltalk/issues/66'
  }
  const messages = {
    'v2ex': 'V2EX 个人简介',
    'github': '小对话的 Github Repo'
  }

  if (!username || !site) {
    return <div />
  }

  return (
    <p>
      复制下面 &darr; 的验证码, 评论到 <a target='_blank' href={urls[site]}>{ messages[site] } </a> 然后点击注册
    </p>
  )
}

class RegistrationSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      usernameIsValid: false,
      email: '',
      site: '',
      code: '',

      copied: false,
      submitStatus: SubmitStatus.Default
    }

    this.onUserNameSubmit = this.onUserNameSubmit.bind(this)
    this.onEmailSubmit = this.onEmailSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSiteClick = this.handleSiteClick.bind(this)
  }

  componentDidMount () {
    const clipboard = new ClipboardJS('.clipboard')
    clipboard.on('success', () => {
      this.setState({ copied: true })
    })

    clipboard.on('error', (e) => {
      this.setState({ copied: false })
    })
  }

  async onUserNameSubmit (username) {
    const { site } = this.state
    if (!site) {
      alert('you have to chose a site')
    }

    this.setState({ username })
    const valid = await api.isValidUser({ username, site })
    this.setState({ usernameIsValid: valid })
    return valid
  }

  async getCode () {
    const { username, email, site } = this.state
    const { code } = await api.getCode({ username, email, site })
    this.setState({ code })
  }

  async onEmailSubmit (email) {
    const ok = maybeEmailAddress(email)
    if (ok) {
      this.setState({ email }, async () => {
        await this.getCode()
      })
    }
    return ok
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

  handleSubmit () {
    const { code, username, email, site } = this.state
    const { onSubmit } = this.props
    this.setState({ submitStatus: SubmitStatus.Submitting })
    onSubmit({ code, username, email, site }, (err, data) => {
      if (err) {
        this.setState({ submitStatus: SubmitStatus.Failed })
      } else {
        this.setState({ submitStatus: SubmitButton.Succeed })
      }
    })
  }

  handleSiteClick (site) {
    this.setState({ site })
  }

  render () {
    const {
      email,
      username,
      usernameIsValid,
      site,
      code,
      submitStatus
    } = this.state
    let message = '注册'
    if (submitStatus === SubmitStatus.Submitting) {
      message = '正在提交'
    } else if (submitStatus === SubmitStatus.Succeed) {
      message = '注册成功'
    } else if (submitStatus === SubmitStatus.Failed) {
      message = '注册失败'
    }

    const isReady = email.length > 0 && code.length > 0 && usernameIsValid

    const sites = [
      {
        name: 'github',
        url: ''
      },
      {
        name: 'hackernews',
        url: ''
      },
      {
        name: 'v2ex',
        url: ''
      }
    ]

    const buttonStyle = styles.SiteButton + ' btn btn-sm btn-outline-secondary'
    const buttonClickedStyle = buttonStyle + ` ${styles.SiteButtonClicked}`
    return (
      <div className={styles.RegistrationContainer}>
        <TitleBox title='开始你的小对话' />
        <div className={styles.FormContainer + ` mb-3`}>
          {
            sites.map((s) => (
              <button
                type='button'
                className={site === s.name ? buttonClickedStyle : buttonStyle}
                onClick={() => this.handleSiteClick(s.name)}
              >
                {s.name}
              </button>
            ))
          }
        </div>
        <div className={styles.FormContainer}>
          <InputRow
            type='text'
            label='输入在上面站点的 id'
            placeholder='id'
            disabled={!site}
            onSubmit={this.onUserNameSubmit}
          />
          <InputRow
            type='email'
            label='输入你的 email'
            placeholder='hello@asmalltalk.com'
            disabled={!usernameIsValid}
            onSubmit={this.onEmailSubmit}
          />
          <div>
            <Indicator username={username} site={site} />
            <div className='input-group mb-3'>
              <input
                className='form-control'
                placeholder='验证码'
                aria-label='验证码'
                type='text'
                id='MagicCode'
                value={code}
                disabled={!usernameIsValid || !email}
              />
              <div className='input-group-append'>
                <button
                  className='btn btn-outline-secondary clipboard'
                  type='button'
                  disabled={!usernameIsValid || !email}
                  data-clipboard-target='#MagicCode'
                  data-clipboard-action='copy'
                >
                  <img src={screenshot} reandonly width='16' alt='复制' />
                </button>
              </div>
            </div>
            <p> {this.verifyCodeTip()}</p>
          </div>
          <SubmitButton
            status={submitStatus}
            message={message}
            handleSubmit={this.handleSubmit}
            disabled={!isReady}
          />
        </div>
      </div>
    )
  }
}

export default RegistrationSection
