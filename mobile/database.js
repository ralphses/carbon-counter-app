class InMemoryDatabase {
    constructor() {
        this.users = [];
        this.carbonFootPrints = [];
        this.userId = 1;
        this.footPrintId = 1;

        this.initializeSampleData();
    }

    // Utility functions
    getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of the year
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (zero-based) to 2 digits
        const day = now.getDate().toString().padStart(2, '0'); // Day to 2 digits
        const hours = now.getHours().toString().padStart(2, '0'); // Hours to 2 digits
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes to 2 digits

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    findById(array, id) {
        return array.find(item => item.id === id);
    }

    // Initialize with sample data
    initializeSampleData() {
        const sampleUsers = [
            {
                id: this.userId++,
                name: 'Alice Johnson',
                address: '123 Apple St',
                noOfVehicles: 1,
                noOfGenerators: 0,
                noOfMotocycles: 1,
                phone: '555-1234',
                email: 'alice@example.com',
                password: 'password123',
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
                averageCarbonFootPrint: 150, // Initial average carbon footprint (example)
            },
            {
                id: this.userId++,
                name: 'Bob Smith',
                address: '456 Orange Ave',
                noOfVehicles: 2,
                noOfGenerators: 1,
                noOfMotocycles: 0,
                phone: '555-5678',
                email: 'eze.raph@gmail.com',
                password: 'password123',
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
                averageCarbonFootPrint: 200, // Initial average carbon footprint (example)
            }
        ];

        const sampleCarbonFootPrints = [
            {
                id: this.footPrintId++,
                user_id: 1,
                date: this.getCurrentTimestamp(),
                value: 150,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },
            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 20,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },
            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 203,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },
            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 7,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },
            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 67,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },

            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 60,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },
            {
                id: this.footPrintId++,
                user_id: 2,
                date: this.getCurrentTimestamp(),
                value: 10,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            },

        ];

        // Calculate initial average carbon footprint for each user
        sampleUsers.forEach(user => {
            const userCarbonFootprints = sampleCarbonFootPrints.filter(fp => fp.user_id === user.id);
            const totalValue = userCarbonFootprints.reduce((sum, fp) => sum + fp.value, 0);
            user.averageCarbonFootPrint = userCarbonFootprints.length > 0 ? totalValue / userCarbonFootprints.length : 0;
        });

        this.users = sampleUsers;
        this.carbonFootPrints = sampleCarbonFootPrints;
    }

    // CRUD Operations for Users

    addUser(name, address, noOfVehicles, noOfGenerators, noOfMotocycles, phone, email, password) {
        return new Promise((resolve, reject) => {
            const user = {
                id: this.userId++,
                name,
                address,
                noOfVehicles,
                noOfGenerators,
                noOfMotocycles,
                phone,
                email,
                password,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
                averageCarbonFootPrint: 0, // Initialize average carbon footprint
            };
            this.users.push(user);
            resolve(user);
        });
    }

    fetchUsers() {
        return new Promise((resolve) => {
            resolve(this.users);
        });
    }

    findUserByEmail(email) {
        return new Promise((resolve) => {
            const user = this.users.find(user => user.email === email);
            resolve(user);
        });
    }

    findUserByEmailAndPassword(email, password) {
        return new Promise((resolve) => {
            const user = this.users.find(user => user.email === email && user.password === password);
            resolve(user);
        });
    }

    // Fetch user profile data by email
    fetchProfileData(email) {
        return new Promise((resolve, reject) => {
            const user = this.users.find(user => user.email === email);
            if (user) {
                // Calculate average carbon footprint for the user
                const userCarbonFootprints = this.carbonFootPrints.filter(fp => fp.user_id === user.id);
                const totalValue = userCarbonFootprints.reduce((sum, fp) => sum + fp.value, 0);
                user.averageCarbonFootPrint = userCarbonFootprints.length > 0 ? totalValue / userCarbonFootprints.length : 0;

                // Simulate API response structure
                const profileData = {
                    name: user.name,
                    address: user.address,
                    noOfVehicles: user.noOfVehicles,
                    noOfGenerators: user.noOfGenerators,
                    noOfMotocycles: user.noOfMotocycles,
                    phone: user.phone,
                    email: user.email,
                    averageCarbonFootPrint: user.averageCarbonFootPrint,
                    carbonFootPrints: userCarbonFootprints,
                };
                resolve(profileData);
            } else {
                reject(new Error('User not found'));
            }
        });
    }

    // CRUD Operations for Carbon Foot Prints

    addCarbonFootPrint(user_id, date, value) {
        return new Promise((resolve, reject) => {
            const user = this.findById(this.users, user_id);
            if (!user) {
                reject(new Error('User not found'));
                return;
            }

            const carbonFootPrint = {
                id: this.footPrintId++,
                user_id,
                date: date || this.getCurrentTimestamp(),
                value,
                created_at: this.getCurrentTimestamp(),
                updated_at: this.getCurrentTimestamp(),
            };
            this.carbonFootPrints.push(carbonFootPrint);

            // Update user's average carbon footprint
            const userCarbonFootprints = this.carbonFootPrints.filter(fp => fp.user_id === user.id);
            const totalValue = userCarbonFootprints.reduce((sum, fp) => sum + fp.value, 0);
            user.averageCarbonFootPrint = userCarbonFootprints.length > 0 ? totalValue / userCarbonFootprints.length : 0;

            resolve(carbonFootPrint);
        });
    }

    fetchCarbonFootPrints(user_id) {
        return new Promise((resolve) => {
            const carbonFootPrints = this.carbonFootPrints.filter(fp => fp.user_id === user_id);
            resolve(carbonFootPrints);
        });
    }
}

const db = new InMemoryDatabase();
export default db;
