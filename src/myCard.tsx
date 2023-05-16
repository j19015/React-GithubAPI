import { Box,Card, CardContent, Typography } from '@mui/material';
import { MyCardProps } from './reposList';
export const MyCard= ({ repos }: MyCardProps) => {
  return (
    <Box sx={{m:2,height: '100%'}}>
      <Card sx={{height: '75%'}}>
        <CardContent>
          <Typography>
            説明:{repos.description}
          </Typography>
          <Typography>
            作成日:{repos.created_at}
          </Typography>
          <Typography>
            更新日時:{repos.updated_at}
          </Typography>
          <Typography>
            Star数:{repos.stargazers_count}
          </Typography>
          <Typography>
            Watch数:{repos.forks_count}
          </Typography>
          <Typography>
            Fork数ss:{repos.created_at}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}