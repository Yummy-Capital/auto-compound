# AUTO-COMPOUND

An auto-compound repository is a software project that enables validators to automatically accumulate rewards. Validators are individuals or entities that contribute computing power to maintain the security and integrity of a blockchain network. In return for their service, validators receive rewards in the form of cryptocurrency.

An auto-compound repository provides a convenient and efficient way for validators to maximize their earnings in a DeFi network. By automating the process of reinvesting rewards, validators can achieve exponential growth in their cryptocurrency holdings, while minimizing the amount of time and effort required to manage their investments.

## 1. Setup a hot wallet

Generate a new hot wallet you will use to automatically carry out the staking transactions. The mnemonic will need to be provided to the script so **use a dedicated wallet and only keep enough funds for transaction fees**.

## 2. Setup project

#### Clone the repository and build it

```bash
git clone https://github.com/Yummy-Capital/auto-compound
cd auto-compound
npm install
npm run build
```

## 3. Grant authorization to hot wallet

#### Option 1: using `chain-maind`

Grant authorization to withdraw validator commission:

```bash
~/chain-maind tx authz grant <grantee> generic \
--allowed-validators <validator> \
--msg-type "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission" \
--from <granter> \
--gas 100000 \
--gas-prices 0.05basecro \
--chain-id crypto-org-chain-mainnet-1 \
--node https://rpc.mainnet.crypto.org:443
```

Grant authorization to delegate:

```bash
~/chain-maind tx authz grant <grantee> delegate \
--allowed-validators <validator> \
--from <granter> \
--gas 100000 \
--gas-prices 0.05basecro \
--chain-id crypto-org-chain-mainnet-1 \
--node https://rpc.mainnet.crypto.org:443
```

#### Option 2: using grant script

```bash
cp env/grant.sample.env env/grant.env
```

**Populate your new `grant.env` file with your `chain`, `grantee address`, `mnemonic` and `validator address`.**

#### Running the script

```bash
npm run grant
```

## 4. Setup auto-compound script

```bash
cp env/compound.sample.env env/compound.env
```

**Populate your new `compound.env` file with your `chain`, `delegator address`, `mnemonic` and `validator address`.**

#### Running the script

```bash
npm run compound
```

## 5. Setting up cron/timers to run the script on a schedule

You can setup your script to run at the same time. Two methods are described below: using `crontab` or using `systemd-timer`.

In both cases, ensure your system time is correct and you know what time the script will run in UTC, as that will be required later. Both examples below are for run every hour.

#### Using `crontab`

Note: A helpful calculator for determining your auto-compound timer for `crontab` can be found here: https://crontab.guru/.

```bash
crontab -e

0 * * * * /bin/bash -c "cd /path/to/auto-compound && npm run compound" > ./auto-compound.log 2>&1
```

#### Using `systemd-timer`

Systemd-timer allows to run a one-off service with specified rules. This method is arguably preferable to Cron.

##### Create a systemd unit file

The unit file describes the application to run. We define a dependency with the timer with the `Wants` statement.

```bash
sudo nano /etc/systemd/system/auto-compound.service
```

```bash
[Unit]
Description=auto-compound service
Wants=auto-compound.timer

[Service]
Type=oneshot
WorkingDirectory=/path/to/auto-compound
ExecStart=/usr/bin/npm run compound

[Install]
WantedBy=multi-user.target
```

##### Create a systemd timer file

The timer file defines the rules for running the auto-compound service every hour. All rules are described in the [systemd documentation](https://www.freedesktop.org/software/systemd/man/systemd.timer.html).

Note: Helpful calculator for determining auto-compound times for `OnCalendar` can also be found at https://crontab.guru/.

```bash
sudo nano /etc/systemd/system/auto-compound.timer
```

```bash
[Unit]
Description=Auto-compound timer

[Timer]
AccuracySec=1min
OnCalendar=*-*-* *:00:00

[Install]
WantedBy=timers.target
```

##### Enable and start everything

```bash
sudo systemctl daemon-reload
sudo systemctl enable auto-compound.service
sudo systemctl enable auto-compound.timer
sudo systemctl start auto-compound.timer
```

##### Check your timer

`sudo systemctl status auto-compound.timer`

<pre>
  <font color="#8AE234"><b>●</b></font>&nbsp;auto-compound.timer - Auto-compound timer
  Loaded: loaded (/etc/systemd/system/auto-compound.timer; enabled; vendor preset: enabled)
  Active: <font color="#8AE234"><b>active (waiting)</b></font> since Mon 2023-03-20 01:51:48 UTC; 14s ago
  Trigger: Mon 2023-03-20 02:00:00 UTC; 7min left
  Triggers: ● auto-compound.service
</pre>

##### Check your service

`sudo systemctl status auto-compound.service`

<pre>
  ● auto-compound.service - auto-compound service
  Loaded: loaded (/etc/systemd/system/auto-compound.service; enabled; vendor preset: enabled)
  Active: inactive (dead)
  TriggeredBy: <font color="#8AE234"><b>●</b></font> auto-compound.timer
</pre>
