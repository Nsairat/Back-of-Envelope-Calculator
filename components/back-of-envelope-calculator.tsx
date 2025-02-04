"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function BackOfEnvelopeCalculator() {
  const [inputs, setInputs] = useState({
    dailyActiveUsers: 1000000,
    requestsPerUserPerDay: 10,
    averageObjectSize: 100, // KB
    readToWriteRatio: 5,
    dataDurationMonths: 12,
  })

  const [results, setResults] = useState<null | {
    requestsPerSecond: number
    storagePerDay: number
    storagePerMonth: number
    totalStorage: number
    readBandwidth: number
    writeBandwidth: number
  }>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const calculateMetrics = () => {
    const secondsPerDay = 24 * 60 * 60
    const daysPerMonth = 30

    const requestsPerSecond = (inputs.dailyActiveUsers * inputs.requestsPerUserPerDay) / secondsPerDay
    const storagePerDay =
      (inputs.dailyActiveUsers * inputs.requestsPerUserPerDay * inputs.averageObjectSize) / 1024 / 1024 // in GB
    const storagePerMonth = storagePerDay * daysPerMonth
    const totalStorage = storagePerMonth * inputs.dataDurationMonths

    const totalRequestsPerSecond = requestsPerSecond * (1 + 1 / inputs.readToWriteRatio) // read + write requests
    const readBandwidth =
      (((totalRequestsPerSecond * inputs.readToWriteRatio) / (1 + inputs.readToWriteRatio)) *
        inputs.averageObjectSize) /
      1024 // in MB/s
    const writeBandwidth = ((totalRequestsPerSecond / (1 + inputs.readToWriteRatio)) * inputs.averageObjectSize) / 1024 // in MB/s

    setResults({
      requestsPerSecond: Math.round(requestsPerSecond),
      storagePerDay: Math.round(storagePerDay),
      storagePerMonth: Math.round(storagePerMonth),
      totalStorage: Math.round(totalStorage),
      readBandwidth: Math.round(readBandwidth),
      writeBandwidth: Math.round(writeBandwidth),
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Back-of-the-Envelope Calculator for System Design</CardTitle>
        <CardDescription>
          Estimate key metrics for your system design. All calculations are rough estimates and should be used as a
          starting point for more detailed analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            calculateMetrics()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dailyActiveUsers">Daily Active Users</Label>
              <Input
                id="dailyActiveUsers"
                name="dailyActiveUsers"
                type="number"
                value={inputs.dailyActiveUsers}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="requestsPerUserPerDay">Requests per User per Day</Label>
              <Input
                id="requestsPerUserPerDay"
                name="requestsPerUserPerDay"
                type="number"
                value={inputs.requestsPerUserPerDay}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="averageObjectSize">Average Object Size (KB)</Label>
              <Input
                id="averageObjectSize"
                name="averageObjectSize"
                type="number"
                value={inputs.averageObjectSize}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="readToWriteRatio">Read to Write Ratio (X:1)</Label>
              <Input
                id="readToWriteRatio"
                name="readToWriteRatio"
                type="number"
                value={inputs.readToWriteRatio}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter the number of read operations for every 1 write operation.
              </p>
            </div>
            <div>
              <Label htmlFor="dataDurationMonths">Data Retention (Months)</Label>
              <Input
                id="dataDurationMonths"
                name="dataDurationMonths"
                type="number"
                value={inputs.dataDurationMonths}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Calculate
          </Button>
        </form>

        {results && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Results:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Requests per Second:</p>
                <p>{results.requestsPerSecond.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Storage per Day (GB):</p>
                <p>{results.storagePerDay.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Storage per Month (GB):</p>
                <p>{results.storagePerMonth.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Total Storage (GB):</p>
                <p>{results.totalStorage.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Read Bandwidth (MB/s):</p>
                <p>{results.readBandwidth.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Write Bandwidth (MB/s):</p>
                <p>{results.writeBandwidth.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

