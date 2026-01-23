import Link from "next/link";

const HackSecureHome = () => {
  return (
    <div className="p-8 text-2xl">
      <div>TODO LIST</div>
      <ul className="ml-4 mt-2 mb-8">
        <li className="text-green-500">
          IMP --- Instance based Challenges ----------- Done
        </li>
        <li>Admin Controls</li>
        <li>Admin Users</li>
        <li>Admin Notifications</li>
        <li>Admin Logs</li>

        <li>User Notifications</li>
        <li>User My Team</li>
        <li>User Challenges</li>
        <li>User Leaderboard</li>
        <li className="text-green-500">User Teams ------------------ Done</li>

        <li className="text-red-500">
          Make sure joining team has max 5 members
        </li>
      </ul>
      <h1 className="mb-4">IN SERVER NOTES...</h1>
      <h3>DOCKER VERSION SHOULD BE 28 OR LESS... OR IT WONT WORK..</h3>
      <div className="bg-gray-900 p-4 m-4">
        <p className="font-mono">$ docker --version</p>
        <p className="font-mono">$ Docker version 28.3.3, build 980b856</p>
      </div>
      <h3 className="mb-4">
        SERVER RAM NEED TO BE 8 OR MORE... OR SERVER WILL CRASH
      </h3>
      <h3>SERVER PACKAGES</h3>
      <ul className="ml-4 mt-2">
        <li>Traefik 3.4</li>
        <li>docker 28 or LESS !!!</li>
        <li>nginx, pm2, and all basic server stuff...</li>
      </ul>

      <div className="p-8 m-4 bg-green-900 text-white ">
        <h1 className="mb-4 font-bold">
          ## Required Server Files all in root dir of this project
        </h1>
        <h3>1, docker-compose.yml</h3>
        <h3>2, traefik.yml</h3>
        <h3>3, nginx file</h3>
      </div>
    </div>
  );
};

export default HackSecureHome;
