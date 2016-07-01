require 'rubygems'
require 'json'
require 'net/http'
require 'time'

eth_api_endpoint = 'http://twodegree01.cloudapp.net:8080'

nodes = 2
last_difficulty = 0

SCHEDULER.every '1m' do
    current_time = Time.now.to_i
    raw_stats = Net::HTTP.get(URI.parse(eth_api_endpoint + '/stats'))
    parsed_stats = JSON.parse(raw_stats)
    
    send_event('transactions', { current: parsed_stats['totalTransactions'] })
    send_event('blocks', { current: parsed_stats['latestBlock']['number'] })
    send_event('size', { current: parsed_stats['latestBlock']['size'] })
    send_event('nodes', { current: nodes })
    send_event('timestamp', { current: (current_time - parsed_stats['latestBlock']['timestamp']) / 60 })
    send_event('difficulty', { value: parsed_stats['latestBlock']['difficulty'] })
    send_event('gasprice', { current: parsed_stats['gasPrice'] })
end
