import { check, sleep } from 'k6'
import http from 'k6/http'

/**
 * 데이터를 조회하는데 여러 데이이터를 참조하는 페이지 - 경로 검색
 * 지하철 역 목록 조회 - 최단 거리 조회
 *
 * VUser = 1
 * Throughput = 11.8 ~ 177
 * Latency = 100ms
 */

export let options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(99)<100'], // 99% of requests must complete below 100ms
  },
}

const BASE_URL = 'https://shinmj-nextstep.n-e.kr'

export default function () {
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  let stationsRes = http.get(`${BASE_URL}/stations`, params)
  check(stationsRes, { 'retrieved stations': (resp) => resp.status === 200 })
  sleep(1)

  let paths = http.get(`${BASE_URL}/paths?source=1&target=78`, params)
  check(paths, { 'retrieved paths': (resp) => resp.status === 200 })
  sleep(1)
}