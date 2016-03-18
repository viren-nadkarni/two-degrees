contract Carboncoin {
    struct Goal {
        uint goalTimestamp;
        uint goalUsage;
        uint currentCumulativeUsage;
        uint previousCumulativeUsage;
    }
    
    /* TODO: carboncoin conversion rate? */

    mapping (address => Goal) internal goals; /* to maintain goals/usage */
    mapping (address => uint) internal ledger; /* to maintain carbon coin balance */

    address public master;

    event earnCoin(address target, uint amount);
    event spendCoin(address target, uint amount);

    function Carboncoin() {
        master = msg.sender;
    }

    function balance() public constant returns (uint) {
        return ledger[msg.sender];
    }
    function balance(address wallet) public constant returns (uint) {
        return ledger[wallet];
    }

    function credit(address target, uint amount) public {
        ledger[target] += amount;

        earnCoin(target, amount);
    }

    function debit(address target, uint amount) public {
        ledger[target] -= amount;

        spendCoin(target, amount);
    }

    /* TODO: limit access to owner */
    
    function setGoal(address target, uint goalTimestamp, uint goalUsage) {
        goals[target].goalTimestamp = goalTimestamp;
        goals[target].goalUsage = goalUsage;
    }

    function getGoal(address coinbase) returns (uint) {
        return goals[coinbase].goalUsage;
    }

    function recordUsage(address target, uint usage) {
        goals[target].currentCumulativeUsage += usage;
    }

    function checkGoal(address target, uint currentTimestamp) returns (bool) {
        uint goalTimestamp = goals[target].goalTimestamp;
        uint goalUsage = goals[target].goalUsage;
        uint totalUsage = goals[target].currentCumulativeUsage - goals[target].previousCumulativeUsage;

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
