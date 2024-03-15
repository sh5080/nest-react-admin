import React from 'react';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

import { Budget } from '../../components/dashboard/overview/budget';
import { LatestOrders } from '../../components/dashboard/overview/latest-orders';
import { LatestProducts } from '../../components/dashboard/overview/latest-products';
import { Sales } from '../../components/dashboard/overview/sales';
import { TasksProgress } from '../../components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '../../components/dashboard/overview/total-customers';
import { TotalProfit } from '../../components/dashboard/overview/total-profit';
import { Traffic } from '../../components/dashboard/overview/traffic';
import Layout from './layout';

export default function Page() {
  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item lg={3} sm={6} xs={12}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TasksProgress sx={{ height: '100%' }} value={75.5} />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TotalProfit sx={{ height: '100%' }} value="$15k" />
        </Grid>
        <Grid item lg={8} xs={12}>
          <Sales
            chartSeries={[
              { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
              { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
            ]}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <LatestProducts
            products={[
              {
                id: 'PRD-005',
                name: 'Soja & Co. Eucalyptus',
                image: '/assets/product-5.png',
                updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
              },
              // Other products...
            ]}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item lg={8} md={12} xs={12}>
          <LatestOrders
            orders={[
              {
                id: 'ORD-007',
                customer: { name: 'Ekaterina Tankova' },
                amount: 30.5,
                status: 'pending',
                createdAt: dayjs().subtract(10, 'minutes').toDate(),
              },
              // Other orders...
            ]}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
