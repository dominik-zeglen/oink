import React from 'react';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
} from 'recharts';

function genData(n, corr) {
  const x = [...Array(n).keys()];
  const Y = x.map(y => Math.sin((3.141 * 2) / n * y * 2));
  return Y.map((y, yi) => ({ x: x[yi], y }));
}
function IndexSection(props) {
  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="headline" style={{ textAlign: 'center' }}>
              Visitors last 3 month
              </Typography>
              <LineChart data={genData(100, 0.9)} width={400} height={200}>
                <XAxis dataKey="x" />
                <YAxis />
                <Line dataKey="y" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="headline" style={{ textAlign: 'center' }}>
              Visitors last 3 month
              </Typography>
              <LineChart data={genData(100, 0.9)} width={400} height={200}>
                <XAxis dataKey="x" />
                <YAxis />
                <Line dataKey="y" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export {
  IndexSection as default,
};
