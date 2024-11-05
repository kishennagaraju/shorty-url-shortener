import React from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Location( { clicks } ) {
    const cityCount = clicks?.reduce(( acc, click ) => {
        if ( !acc[click?.city] )
            acc[click?.city] = 1;
        else
            acc[click?.city] += 1;

        return acc;
    }, {});

    const cities = Object.entries(cityCount).map(( [ city, count ] ) => ({
        city,
        count
    }));

    return (
      <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
              <LineChart width={700} height={300} data={cities.slice(0, 5)}>
                  <XAxis dataKey="city"/>
                  <YAxis/>
                  <Tooltip labelStyle={{ color: "green" }}/>
                  <Legend/>
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }}/>
              </LineChart>
          </ResponsiveContainer>
      </div>
    );
}
