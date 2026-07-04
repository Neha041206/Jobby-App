import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    job: {},
    similar: [],
    latestMatch: {},
    status: 'INITIAL',
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: 'LOADING'})

    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const res = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (res.ok) {
      this.setState({
        job: data.job_details,
        similar: data.similar_jobs || [],
        latestMatch: data.latest_match_details || {},
        status: 'SUCCESS',
      })
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  renderSuccess = () => {
    const {job, similar, latestMatch} = this.state

    return (
      <div>
        <img src={job.company_logo_url} alt="job details company logo" />

        <h1>{job.title}</h1>
        <p>{job.rating}</p>
        <p>{job.location}</p>
        <p>{job.employment_type}</p>
        <p>{job.package_per_annum}</p>

        <h1>Description</h1>
        <p>{job.job_description}</p>

        <a href={job.company_website_url} target="_blank" rel="noreferrer">
          Visit
        </a>

        {/* MAN OF THE MATCH (IMPORTANT TEST CASE) */}
        <p>{latestMatch.man_of_the_match}</p>

        <h1>Skills</h1>
        <ul>
          {job.skills?.map(skill => (
            <li key={skill.name}>
              <img src={skill.image_url} alt={skill.name} />
              <p>{skill.name}</p>
            </li>
          ))}
        </ul>

        <h1>Life at Company</h1>
        <div>
          <p>{job.life_at_company?.description}</p>
          <img src={job.life_at_company?.image_url} alt="life at company" />
        </div>

        <h1>Similar Jobs</h1>
        <ul>
          {similar.map(j => (
            <li key={j.id}>
              <img src={j.company_logo_url} alt="similar job company logo" />
              <h1>{j.title}</h1>
              <p>{j.rating}</p>
              <p>{j.location}</p>
              <p>{j.employment_type}</p>

              <h1>Description</h1>
              <p>{j.job_description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  render() {
    const {status} = this.state

    return (
      <>
        <Header />

        {status === 'LOADING' && this.renderLoader()}
        {status === 'SUCCESS' && this.renderSuccess()}
        {status === 'FAILURE' && this.renderFailure()}
      </>
    )
  }
}

export default JobItemDetails
