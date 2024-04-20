// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Judge {
    address judge_address;
    String name;
    Vec<uint> case_ids;
}

struct Client {
    address client_address;
    String name;
    Vec<uint> case_ids;
}

struct Lawyer {
    address lawyer_address;
    String name;
    Vec<uint> case_ids;
}

struct Document {
    String document_hash;
    String description;
    address uploader;
}

struct Case {
    uint case_id;
    String case_name;
    String case_desc;
    Vec<address> judge_addresses;
    Vec<address> lawyer_addresses;
    Vec<address> client_addresses;
    Mapping<uint, Document> documents;
    uint document_count;
}

pub struct Evault {
    admin: Address,
    judge_list: Vec<Judge>,
    client_list: Vec<Client>,
    lawyer_list: Vec<Lawyer>,
    case_list: Vec<Case>,
    judges: Mapping<Address, Judge>,
    clients: Mapping<Address, Client>,
    lawyers: Mapping<Address, Lawyer>,
    cases: Mapping<uint, Case>,
    case_id_counter: uint,
}

impl Evault {
    pub fn new(admin: Address) -> Self {
        Self {
            admin,
            judge_list: Vec::new(),
            client_list: Vec::new(),
            lawyer_list: Vec::new(),
            case_list: Vec::new(),
            judges: Mapping::new(),
            clients: Mapping::new(),
            lawyers: Mapping::new(),
            cases: Mapping::new(),
            case_id_counter: 1,
        }
    }

    // Modifier to restrict functions to the admin
    pub fn only_admin(&self) {
        require(msg.sender == self.admin, "Only admin can perform this operation");
    }

    // Modifier to restrict functions to the case participants
    pub fn only_case_participants(&self, case_id: uint) {
        let case_instance = self.cases[case_id];
        let msg_sender = msg.sender;

        require(
            self.is_judge_in_case(msg_sender, case_instance.judge_addresses) || 
            self.is_lawyer_in_case(msg_sender, case_instance.lawyer_addresses), 
            "Only judges and lawyers of the case can perform this operation"
        );
    }

    pub fn is_judge_in_case(&self, judge_address: Address, judge_addresses: Vec<Address>) -> bool {
        judge_addresses.contains(&judge_address)
    }

    pub fn is_lawyer_in_case(&self, lawyer_address: Address, lawyer_addresses: Vec<Address>) -> bool {
        lawyer_addresses.contains(&lawyer_address)
    }

    // Function to create a new judge (restricted to admin)
    pub fn add_judge(&mut self, judge_address: Address, name: String) {
        // Validate input
        require(judge_address != Address(0), "Invalid judge address");
        require(name.len() > 0, "Judge name cannot be empty");

        // Check if the judge already exists
        require(!self.judges.contains(&judge_address), "Judge already exists");

        let judge = Judge {
            judge_address,
            name,
            case_ids: Vec::new(),
        };
        self.judges.insert(judge_address, judge);
        self.judge_list.push(judge);
    }

    // Function to create a new client (restricted to admin)
    pub fn add_client(&mut self, client_address: Address, name: String) {
        // Validate input
        require(client_address != Address(0), "Invalid client address");
        require(name.len() > 0, "Client name cannot be empty");

        // Check if the client already exists
        require(!self.clients.contains(&client_address), "Client already exists");

        let client = Client {
            client_address,
            name,
            case_ids: Vec::new(),
        };
        self.clients.insert(client_address, client);
        self.client_list.push(client);
    }

    // Function to create a new lawyer (restricted to admin)
    pub fn add_lawyer(&mut self, lawyer_address: Address, name: String) {
        // Validate input
        require(lawyer_address != Address(0), "Invalid lawyer address");
        require(name.len() > 0, "Lawyer name cannot be empty");

        // Check if the lawyer already exists
        require(!self.lawyers.contains(&lawyer_address), "Lawyer already exists");

        let lawyer = Lawyer {
            lawyer_address,
            name,
            case_ids: Vec::new(),
        };
        self.lawyers.insert(lawyer_address, lawyer);
        self.lawyer_list.push(lawyer);
    }

    // Function to create a new case (restricted to admin)
    pub fn create_case(&mut self, case_name: String, case_desc: String, judge_addresses: Vec<Address>, client_addresses: Vec<Address>, lawyer_addresses: Vec<Address>) {
        // Check permissions and validate input
        self.only_admin();

        for judge_address in &judge_addresses {
            require(self.judges.contains(&judge_address), "Invalid judge address");
        }

        for client_address in &client_addresses {
            require(self.clients.contains(&client_address), "Invalid client address");
        }

        for lawyer_address in &lawyer_addresses {
            require(self.lawyers.contains(&lawyer_address), "Invalid lawyer address");
        }

        let case_instance = Case {
            case_id: self.case_id_counter,
            case_name,
            case_desc,
            judge_addresses,
            lawyer_addresses,
            client_addresses,
            documents: Mapping::new(),
            document_count: 0,
        };
        self.cases.insert(self.case_id_counter, case_instance);
        self.case_list.push(case_instance);

        // Update case ids for judges, clients, and lawyers
        for judge_address in &judge_addresses {
            let judge = self.judges[judge_address];
            judge.case_ids.push(self.case_id_counter);
            self.judges.insert(judge_address, judge);
        }

        for client_address in &client_addresses {
            let client = self.clients[client_address];
            client.case_ids.push(self.case_id_counter);
            self.clients.insert(client_address, client);
        }

        for lawyer_address in &lawyer_addresses {
            let lawyer = self.lawyers[lawyer_address];
            lawyer.case_ids.push(self.case_id_counter);
            self.lawyers.insert(lawyer_address, lawyer);
        }

        self.case_id_counter += 1;
    }

    // Other functions omitted for brevity...
}

// Function to convert bytes to string
fn bytes_to_string(bytes: &[u8]) -> String {
    String::from_utf8_lossy(bytes).to_string()
}
