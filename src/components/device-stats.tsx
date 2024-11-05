import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function Device( { clicks } ) {
    const deviceCount = clicks?.reduce(( acc, click ) => {
        if ( !acc[click?.device.toLowerCase()] )
            acc[click?.device.toLowerCase()] = 0;

        acc[click?.device.toLowerCase()]++;

        return acc;
    }, {});

    const devices = Object.entries(deviceCount).map(( [ device ] ) => ({
        device,
        count: deviceCount[device]
    }));

    const COLORS = [ '#0088FE', '#00C49F', '#FFBB28', '#FF8042' ];

    return (
      <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
              <PieChart width={700} height={300}>
                  <Pie
                    data={devices}
                    labelLine={false}
                    label={( { device, percent } ) => `${device}: ${(percent * 100).toFixed(0)}`}
                    dataKey="count"
                  >
                      {devices?.map(( __, index ) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))}
                  </Pie>
              </PieChart>
          </ResponsiveContainer>
      </div>
    );
}