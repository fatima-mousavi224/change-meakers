import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import prisma from '../../lib/prismaDB';
import { getCurrentUser } from '../../utilities/getCurrentUser';
import HeadProfile from './HeadProfile';

async function getData() {
  try {
    const currentUser = await getCurrentUser();
    const userProfile = await prisma.userProfile.findFirst({
      where: {
        userId: currentUser?.id
      },
      include: {
        user: true
      }
    });

    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

export default async function Profile() {
  const userProfile = await getData();

  const rows = [
    {
      name: userProfile?.city,
      calories: userProfile?.country,
      fat: userProfile?.email,
      carbs: userProfile?.phone,
      protein: ''
    }
  ];

  return (
    <div className="sm:bg-[#FFFFFF] bg-light_gray w-full flex flex-col justify-center items-start pt-10 pb-10 overflow-hidden px-5">
      {!userProfile && (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <h1 className="lg:text-3xl text-2xl font-bold">No Profile Found</h1>
        </div>
      )}
      {userProfile && (
        <>
          <HeadProfile userProfile={userProfile} />

          <div className="lg:w-[70%] w-full mx-auto">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>city</TableCell>
                    <TableCell align="right">country</TableCell>
                    <TableCell align="right">email</TableCell>
                    <TableCell align="right">phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
}
