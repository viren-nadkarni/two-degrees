contract Carboncoin {
    struct Goal {
        uint256 goalTimestamp;
        uint256 goalUsage;
        uint256 currentCumulativeUsage;
        uint256 previousCumulativeUsage;
    }
    
    /* TODO: carboncoin conversion rate? */

    mapping (address => Goal) internal goals; /* to maintain goals/usage */
    mapping (address => uint256) internal ledger; /* to maintain carbon coin balance */

    address public master;

    event earnCoin(address target, uint256 amount);
    event spendCoin(address target, uint256 amount);

    function Carboncoin() {
        master = msg.sender;
    }

    function balance() public constant returns (uint256) {
        return ledger[msg.sender];
    }
    function balanceOf(address wallet) public constant returns (uint256) {
        return ledger[wallet];
    }

    function credit(address target, uint256 amount) public {
        ledger[target] += amount;

        earnCoin(target, amount);
    }
    function debit(address target, uint256 amount) public {
        ledger[target] -= amount;

        spendCoin(target, amount);
    }

    /* TODO: limit access to owner */
    
    function setGoal(address target, uint256 goalTimestamp, uint256 goalUsage) public {
        goals[target].goalTimestamp = goalTimestamp;
        goals[target].goalUsage = goalUsage;
    }

    function getGoal(address coinbase) public returns (uint256) {
        return goals[coinbase].goalUsage;
    }

    function recordUsage(address target, uint256 usage) public {
        goals[target].currentCumulativeUsage += usage;
    }

    function checkGoal(address target, uint256 currentTimestamp) public returns (bool) {
        uint256 goalTimestamp = goals[target].goalTimestamp;
        uint256 goalUsage = goals[target].goalUsage;
        uint256 totalUsage = goals[target].currentCumulativeUsage - goals[target].previousCumulativeUsage;

        /*if (currentTimestamp >= goalTimestamp) { */
        if (totalUsage < goalUsage) {
            credit(target, totalUsage - goalUsage);
            return true;
        } /*else {
            debit(target, goalUsage - totalUsage);
            return false;
        }*/

        /* TODO: add logic to reset goals */
        
        goals[target].previousCumulativeUsage = goals[target].currentCumulativeUsage;
    }
}
