import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import Header from '../Header'
import {employmentTypesList, salaryRangesList} from '../../Constants'

class Jobs extends Component {
  state = {
    jobs: [],
    search: '',
    employmentType: [],
    salary: '',
    profile: {},
    profileStatus: 'INITIAL',
    jobsStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileStatus: 'LOADING'})

    const token = Cookies.get('jwt_token')

    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      this.setState({
        profile: data.profile_details,
        profileStatus: 'SUCCESS',
      })
    } else {
      this.setState({profileStatus: 'FAILURE'})
    }
  }

  getJobs = async () => {
    this.setState({jobsStatus: 'LOADING'})

    const {search, employmentType, salary} = this.state
    const token = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salary}&search=${search}`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      this.setState({
        jobs: data.jobs,
        jobsStatus: 'SUCCESS',
      })
    } else {
      this.setState({jobsStatus: 'FAILURE'})
    }
  }

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = id => {
    this.setState(
      prevState => ({
        employmentType: prevState.employmentType.includes(id)
          ? prevState.employmentType.filter(eachId => eachId !== id)
          : [...prevState.employmentType, id],
      }),
      this.getJobs,
    )
  }

  onChangeSalary = id => {
    this.setState({salary: id}, this.getJobs)
  }

  renderProfileSection = () => {
    const {profile, profileStatus} = this.state

    if (profileStatus === 'LOADING') {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" />
        </div>
      )
    }

    if (profileStatus === 'SUCCESS') {
      return (
        <div>
          <img src={profile.profile_image_url} alt="profile" />
          <h1>{profile.name}</h1>
          <p>{profile.short_bio}</p>
        </div>
      )
    }

    return (
      <div>
        <button type="button" onClick={this.getProfile}>
          Retry
        </button>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobs} = this.state

    if (jobs.length === 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              <img src={job.company_logo_url} alt="company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employment_type}</p>
              <p>{job.package_per_annum}</p>

              <h1>Description</h1>
              <p>{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {jobsStatus} = this.state

    if (jobsStatus === 'LOADING') {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" />
        </div>
      )
    }

    if (jobsStatus === 'SUCCESS') {
      return this.renderJobsList()
    }

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.getJobs}>
          Retry
        </button>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />

        {this.renderProfileSection()}

        <input type="search" onChange={this.onChangeSearch} />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickSearch}
        >
          <BsSearch />
        </button>

        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(item => (
            <li key={item.employmentTypeId}>
              <input
                type="checkbox"
                id={item.employmentTypeId}
                onChange={() =>
                  this.onChangeEmploymentType(item.employmentTypeId)
                }
              />
              <label htmlFor={item.employmentTypeId}>{item.label}</label>
            </li>
          ))}
        </ul>

        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(item => (
            <li key={item.salaryRangeId}>
              <input
                type="radio"
                id={item.salaryRangeId}
                name="salary"
                onChange={() => this.onChangeSalary(item.salaryRangeId)}
              />
              <label htmlFor={item.salaryRangeId}>{item.label}</label>
            </li>
          ))}
        </ul>

        {this.renderJobsSection()}
      </>
    )
  }
}

export default Jobs
