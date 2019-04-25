new Vue ({
    el: '#app',

    data:{
        playerhealth: 100,
        playerpower: 0,
        playerpowerrecharge: 0,
        specialpowerenough: false,
        ultypowerenough: false,
        healpowerenough: false,
        playerbasicdmg: 5,
        playercrithitchance: 0,
        playercritdmg: 10,
        playerspecialdmg: 10,
        playerultydmg: 20,
        playertotaldmg: 0,
        playerdead: false,
        playerattackfirst: false,
        bosshealth: 100,
        bossbasicdmg: 10,
        bosscrithitchance: 0,
        bosscritdmg: 10,
        bosstotaldmg: 0,
        bossdead: false,
        bossattackfirst: false,
        playerlogarray: [],
        bosslogarray: [],
        playerimg: 'iori.png',
        bossimg: 'mukai.png',
    },

    // watch: {
    //     playertotaldmg: function() {
    //         if (Math.round(this.playertotaldmg * 0.5) + this.playerpower <= 100) {
    //             this.playerpowerrecharge += Math.round(this.playertotaldmg * 0.5);
    //             this.playerpower += Math.round(this.playertotaldmg * 0.5);
    //         }
    //         else {
    //             this.playerpowerrecharge = 100 - this.playerpower;
    //             this.playerpower = 100;
    //         }
    //     },
    //
    //     bosstotaldmg: function() {
    //         if (Math.round(this.bosstotaldmg * 0.5) + this.playerpower <= 100) {
    //             this.playerpowerrecharge += Math.round(this.bosstotaldmg * 0.5);
    //             this.playerpower += Math.round(this.bosstotaldmg * 0.5);
    //         }
    //         else {
    //             this.playerpowerrecharge = 100 - this.playerpower;
    //             this.playerpower = 100;
    //         }
    //     },
    // },

    computed:{
        playerhealthStyle: function() {
            return {width: this.playerhealth + '%', backgroundColor: 'green', margin: '0', color: 'black'};
        },

        bosshealthStyle: function(){
            return {width: this.bosshealth + '%', backgroundColor: 'green', margin: '0', color: 'black'};
        },

        playerpowerStyle: function(){
            return {width: this.playerpower + '%', backgroundColor: '#fed400', margin: '0', color: 'black'};
        },

        specialPower: function() {
            if (this.playerpower >= 20) {return this.specialpowerenough = true;}
            else {return this.specialpowerenough = false;}
        },

        ultyPower: function() {
            if (this.playerpower >= 50) {return this.ultypowerenough = true;}
            else {return this.ultypowerenough = false;}
        },

        healPower: function() {
            if (this.playerpower >= 20) {return this.healpowerenough = true;}
            else {return this.healpowerenough = false;}
        },
    },

    methods: {
        resetAll: function () {
            this.playerhealth = 100;
            this.playerpower = 0;
            this.playerpowerrecharge = 0;
            this.playerdead = false;
            this.playerattackfirst = false;
            this.bosshealth = 100;
            this.bossdead = false;
            this.bossattackfirst = false;
            this.playerlogarray = [];
            this.bosslogarray = [];
            this.playerimg = 'iori.png';
            this.bossimg = 'mukai.png';
        },

        attackFirst: function () {
            if (this.randomChance() % 2 === 0) {
                this.playerattackfirst = true;
            } else {
                this.bossattackfirst = true;
            }
        },

        randomChance: function () {
            var arr = new Uint8Array(1);
            crypto.getRandomValues(arr);
            return Math.round(arr[0]);
        },

        bossAttack: function() {
            this.bosscrithitchance = this.randomChance() % 100;
            this.bosstotaldmg = Math.round(this.bossbasicdmg + this.bosscrithitchance / 100 * this.bosscritdmg);
            this.bosspowerAdjustment();
            this.bossimg = 'mukai attack.png'
        },

        attackDamage: function () {
            if (this.playerattackfirst === false && this.bossattackfirst === false) {}
            else {
                this.playerimg = 'iori attack.jpg';
                this.playercrithitchance = this.randomChance() % 100;
                this.playertotaldmg = Math.round(this.playerbasicdmg + this.playercrithitchance / 100 * this.playercritdmg);
                this.playerpowerAdjustment();
                this.bossAttack();
                this.healthReduction('basic');
            }
        },

        specialDamage: function (){
            this.playerimg = 'iori special.jpg';
            this.playerpower -= 20;
            this.playercrithitchance = this.randomChance() % 100;
            this.playertotaldmg = Math.round(this.playerspecialdmg + this.playercrithitchance / 100 * this.playercritdmg);
            this.playerpowerAdjustment();
            this.bossAttack();
            this.healthReduction('special');
        },

        ultyDamage: function(){
            this.playerimg = 'iori ulty.jpg';
            this.playerpower -= 50;
            this.playercrithitchance = this.randomChance() % 100;
            this.playertotaldmg = Math.round(this.playerultydmg + this.playercrithitchance / 100 * this.playercritdmg);
            this.playerpowerAdjustment();
            this.bossAttack();
            this.healthReduction('ulty');
        },

        giveUp: function() {
            this.playerhealth = 0;
            this.playerpower = 0;
            this.playerdead = true;
            this.playerdeathAlert();
        },

        playerdeathAlert: function() {
            this.playerimg = 'iori dead.jpg';
            setTimeout(function () {
                alert("Game Over! Sucker! You Are Slayed By The Boss!")
            }, 1000);
        },

        bossdeathAlert: function() {
            this.bossimg = 'mukai dead.png';
            setTimeout(function(){
                alert("Congratulations! Winner! You Have Slayed The Boss!!!")
            }, 1000);
        },

        playerpowerAdjustment: function() {
            if (Math.round(this.playertotaldmg * 0.5) + this.playerpower <= 100) {
                this.playerpowerrecharge += Math.round(this.playertotaldmg * 0.5);
                this.playerpower += Math.round(this.playertotaldmg * 0.5);
            }
            else {
                this.playerpowerrecharge = 100 - this.playerpower;
                this.playerpower = 100;
            }
        },

        bosspowerAdjustment: function() {
            if (Math.round(this.bosstotaldmg * 0.5) + this.playerpower <= 100) {
                this.playerpowerrecharge += Math.round(this.bosstotaldmg * 0.5);
                this.playerpower += Math.round(this.bosstotaldmg * 0.5);
            }
            else {
                this.playerpowerrecharge = 100 - this.playerpower;
                this.playerpower = 100;
            }
        },

        chargePower: function() {
            this.playerimg = 'iori power.png';
            if (this.playerattackfirst === true && this.bossattackfirst === false) {
                this.bossAttack();
                this.playertotaldmg = 0;
                if(this.playerpower <= 80) {
                    this.playerpower += 20;
                    this.playerpowerrecharge += 20;
                    this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                    this.playerlogarray.push(' ');
                    this.playerpowerrecharge = 0;
                    this.healthReduction(null);
                }
                else {
                    this.playerpowerrecharge = 100 - this.playerpower;
                    this.playerpower = 100;
                    this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                    this.playerlogarray.push(' ');
                    this.playerpowerrecharge = 0;
                    this.healthReduction(null);
                }
            }
            else if (this.playerattackfirst === false && this.bossattackfirst === true) {
                this.bossAttack();
                this.playertotaldmg = 0;
                this.healthReduction(null);
                if (this.playerdead === false) {
                    if(this.playerpower <= 80) {
                        this.playerpower += 20;
                        this.playerpowerrecharge += 20;
                        this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                        this.playerlogarray.push(' ');
                        this.playerpowerrecharge = 0;
                    }
                    else {
                        this.playerpowerrecharge = 100 - this.playerpower;
                        this.playerpower = 100;
                        this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                        this.playerlogarray.push(' ');
                        this.playerpowerrecharge = 0;
                    }
                }
            }
        },

        healing: function() {
            this.playerimg = 'iori heal.jpg';
            this.playerpower -= 20;
            this.bossAttack();
            this.playertotaldmg = 0;
            if (this.playerattackfirst === true && this.bossattackfirst === false) {
                if (this.playerhealth <= 75) {
                    this.playerhealth += 25;
                    this.playerlogarray.push('You recover 25 health');
                    this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                    this.playerpowerrecharge = 0;
                    this.healthReduction(null);
                }
                else {
                    this.playerlogarray.push('You recover ' + (100 - this.playerhealth) + ' health');
                    this.playerhealth = 100;
                    this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                    this.playerpowerrecharge = 0;
                    this.healthReduction(null);
                }
            }
            else if (this.playerattackfirst === false && this.bossattackfirst === true) {
                this.healthReduction(null);
                if (this.playerdead === false) {
                    if (this.playerhealth <= 75) {
                        this.playerhealth += 25;
                        this.playerlogarray.push('You recover 25 health');
                        this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                        this.playerpowerrecharge = 0;
                    } else {
                        this.playerlogarray.push('You recover ' + (100 - this.playerhealth) + ' health');
                        this.playerhealth = 100;
                        this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                        this.playerpowerrecharge = 0;
                    }
                }
            }
        },

        healthReduction: function (text) {
            var vm = this;
            if (this.playerattackfirst === true && this.bossattackfirst === false) {
                if (text !== null) {
                    this.playerlogarray.push('You Dealt ' + this.playertotaldmg + ' ' + text + ' damage');
                    this.playerlogarray.push('You recharged ' + this.playerpowerrecharge + ' power');
                    this.playerpowerrecharge = 0;
                }
                if (this.bosshealth > this.playertotaldmg) {
                    this.bosshealth -= this.playertotaldmg;
                    setTimeout(function () {
                        vm.bosslogarray.push('Boss Dealt ' + vm.bosstotaldmg + ' damage');
                        vm.bosslogarray.push(' ');
                        if (vm.playerhealth > vm.bosstotaldmg) {
                            vm.playerhealth -= vm.bosstotaldmg;
                        } else {
                            vm.playerhealth = 0;
                            vm.playerdead = true;
                            vm.playerpower = 0;
                            vm.playerdeathAlert();
                            vm.playerattackfirst = false;
                        }
                    }, 10);
                } else {
                    this.bosshealth = 0;
                    this.bossdead = true;
                    this.bossdeathAlert();
                    this.playerattackfirst = false;
                }
            } else if (this.playerattackfirst === false && this.bossattackfirst === true) {
                this.bosslogarray.push('Boss Dealt ' + this.bosstotaldmg + ' damage');
                this.bosslogarray.push(' ');
                if (this.playerhealth > this.bosstotaldmg) {
                    this.playerhealth -= this.bosstotaldmg;
                    setTimeout(function () {
                        if (text !== null) {
                            vm.playerlogarray.push('You Dealt ' + vm.playertotaldmg + ' ' + text + ' damage');
                            vm.playerlogarray.push('You recharged ' + vm.playerpowerrecharge + ' power');
                            vm.playerpowerrecharge = 0;
                        }
                        if (vm.bosshealth > vm.playertotaldmg) {
                            vm.bosshealth -= vm.playertotaldmg;
                        } else {
                            vm.bosshealth = 0;
                            vm.bossdead = true;
                            vm.bossdeathAlert();
                            vm.bossattackfirst = false;
                        }
                    }, 10);
                } else {
                    this.playerhealth = 0;
                    this.playerdead = true;
                    this.playerpower = 0;
                    this.playerdeathAlert();
                    this.bossattackfirst = false;
                }
            }
        },
    }
})