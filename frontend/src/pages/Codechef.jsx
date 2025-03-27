import UserProfile from "./MyProfile"


const Codechef = () => {
  return (
    <div>
      <UserProfile
        platformUser="codechefUser"
        apiEndpoint="https://codechef-api.vercel.app/handle"
      ></UserProfile>
  </div>
  )
}

export default Codechef
