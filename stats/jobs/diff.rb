require 'net/http'
require 'json'

eth_api_endpoint = 'http://twodegree01.cloudapp.net:8080'

points = []
(1..10).each do |i|
  points << { x: i, y: 100000 + rand(100000) }
end
last_x = points.last[:x]
current_difficulty = 0

SCHEDULER.every '1s' do
    raw_stats = Net::HTTP.get(URI.parse(eth_api_endpoint + '/stats'))
    parsed_stats = JSON.parse(raw_stats)
    last_difficulty = current_difficulty
    current_difficulty = parsed_stats['latestBlock']['difficulty']

    if last_difficulty != current_difficulty
        points.shift
        last_x += 1
        points << { x: last_x, y: current_difficulty }
    end

    send_event('difficulty', points: points)
end

