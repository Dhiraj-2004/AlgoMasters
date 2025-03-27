import UserProfile from "./MyProfile"

const Leetcode = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  return (
    <div>
      <UserProfile
        platformUser="leetcodeUser"
        apiEndpoint={`${backendUrl}/api/user/leetcode`}
      ></UserProfile>
    </div>
  )
}

export default Leetcode
