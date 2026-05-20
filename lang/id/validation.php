<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    */

    'accepted' => ':Attribute harus diterima.',
    'accepted_if' => ':Attribute harus diterima ketika :other adalah :value.',
    'active_url' => ':Attribute bukan URL yang valid.',
    'after' => ':Attribute harus tanggal setelah :date.',
    'after_or_equal' => ':Attribute harus tanggal setelah atau sama dengan :date.',
    'alpha' => ':Attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':Attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
    'alpha_num' => ':Attribute hanya boleh berisi huruf dan angka.',
    'array' => ':Attribute harus berupa array.',
    'ascii' => ':Attribute hanya boleh berisi karakter alfanumerik dan simbol satu byte.',
    'before' => ':Attribute harus tanggal sebelum :date.',
    'before_or_equal' => ':Attribute harus tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':Attribute harus antara :min dan :min item.',
        'file' => ':Attribute harus antara :min dan :max kilobita.',
        'numeric' => ':Attribute harus antara :min dan :max.',
        'string' => ':Attribute harus antara :min dan :max karakter.',
    ],
    'boolean' => 'Isian :attribute harus true atau false.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Kata sandi salah.',
    'date' => ':Attribute bukan tanggal yang valid.',
    'date_equals' => ':Attribute harus tanggal sama dengan :date.',
    'date_format' => ':Attribute tidak cocok dengan format :format.',
    'decimal' => ':Attribute harus memiliki :decimal tempat desimal.',
    'declined' => ':Attribute harus ditolak.',
    'declined_if' => ':Attribute harus ditolak ketika :other adalah :value.',
    'different' => ':Attribute dan :other harus berbeda.',
    'digits' => ':Attribute harus :digits digit.',
    'digits_between' => ':Attribute harus antara :min dan :max digit.',
    'dimensions' => 'Dimensi gambar :attribute tidak valid.',
    'distinct' => 'Isian :attribute memiliki nilai duplikat.',
    'doesnt_end_with' => ':Attribute tidak boleh diakhiri dengan salah satu dari berikut: :values.',
    'doesnt_start_with' => ':Attribute tidak boleh dimulai dengan salah satu dari berikut: :values.',
    'email' => ':Attribute harus alamat email yang valid.',
    'ends_with' => ':Attribute harus diakhiri dengan salah satu dari: :values.',
    'enum' => ':Attribute yang dipilih tidak valid.',
    'exists' => ':Attribute yang dipilih tidak valid.',
    'extensions' => ':Attribute harus memiliki ekstensi: :values.',
    'file' => ':Attribute harus berupa file.',
    'filled' => 'Isian :attribute harus diisi.',
    'gt' => [
        'array' => ':Attribute harus memiliki lebih dari :value item.',
        'file' => ':Attribute harus lebih besar dari :value kilobita.',
        'numeric' => ':Attribute harus lebih besar dari :value.',
        'string' => ':Attribute harus lebih besar dari :value karakter.',
    ],
    'gte' => [
        'array' => ':Attribute harus memiliki :value item atau lebih.',
        'file' => ':Attribute harus lebih besar dari atau sama dengan :value kilobita.',
        'numeric' => ':Attribute harus lebih besar dari atau sama dengan :value.',
        'string' => ':Attribute harus lebih besar dari atau sama dengan :value karakter.',
    ],
    'hex_color' => ':Attribute harus berupa warna heksadesimal yang valid.',
    'image' => ':Attribute harus berupa gambar.',
    'in' => ':Attribute yang dipilih tidak valid.',
    'in_array' => 'Isian :attribute tidak ada dalam :other.',
    'integer' => ':Attribute harus berupa bilangan bulat.',
    'ip' => ':Attribute harus berupa alamat IP yang valid.',
    'ipv4' => ':Attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => ':Attribute harus berupa alamat IPv6 yang valid.',
    'json' => ':Attribute harus berupa JSON yang valid.',
    'list' => ':Attribute harus berupa daftar.',
    'lowercase' => ':Attribute harus berupa huruf kecil.',
    'lt' => [
        'array' => ':Attribute harus memiliki kurang dari :value item.',
        'file' => ':Attribute harus kurang dari :value kilobita.',
        'numeric' => ':Attribute harus kurang dari :value.',
        'string' => ':Attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':Attribute tidak boleh memiliki lebih dari :value item.',
        'file' => ':Attribute harus kurang dari atau sama dengan :value kilobita.',
        'numeric' => ':Attribute harus kurang dari atau sama dengan :value.',
        'string' => ':Attribute harus kurang dari atau sama dengan :value karakter.',
    ],
    'mac_address' => ':Attribute harus berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':Attribute tidak boleh memiliki lebih dari :max item.',
        'file' => ':Attribute tidak boleh lebih besar dari :max kilobita.',
        'numeric' => ':Attribute tidak boleh lebih besar dari :max.',
        'string' => ':Attribute tidak boleh lebih besar dari :max karakter.',
    ],
    'max_digits' => ':Attribute tidak boleh memiliki lebih dari :max digit.',
    'mimes' => ':Attribute harus berupa file dengan tipe: :values.',
    'mimetypes' => ':Attribute harus berupa file dengan tipe: :values.',
    'min' => [
        'array' => ':Attribute harus memiliki setidaknya :min item.',
        'file' => ':Attribute harus setidaknya :min kilobita.',
        'numeric' => ':Attribute harus setidaknya :min.',
        'string' => ':Attribute harus setidaknya :min karakter.',
    ],
    'min_digits' => ':Attribute harus memiliki setidaknya :min digit.',
    'missing' => 'Isian :attribute harus tidak ada.',
    'missing_if' => 'Isian :attribute harus tidak ada ketika :other adalah :value.',
    'missing_unless' => 'Isian :attribute harus tidak ada kecuali :other adalah :value.',
    'missing_with' => 'Isian :attribute harus tidak ada ketika :values ada.',
    'missing_with_all' => 'Isian :attribute harus tidak ada ketika :values ada.',
    'multiple_of' => ':Attribute harus merupakan kelipatan dari :value.',
    'not_in' => ':Attribute yang dipilih tidak valid.',
    'not_regex' => 'Format :attribute tidak valid.',
    'numeric' => ':Attribute harus berupa angka.',
    'password' => [
        'letters' => ':Attribute harus mengandung setidaknya satu huruf.',
        'mixed' => ':Attribute harus mengandung setidaknya satu huruf besar dan satu huruf kecil.',
        'numbers' => ':Attribute harus mengandung setidaknya satu angka.',
        'symbols' => ':Attribute harus mengandung setidaknya satu simbol.',
        'uncompromised' => ':Attribute yang diberikan telah muncul dalam kebocoran data. Silakan pilih :attribute yang berbeda.',
    ],
    'present' => 'Isian :attribute harus ada.',
    'present_if' => 'Isian :attribute harus ada ketika :other adalah :value.',
    'present_unless' => 'Isian :attribute harus ada kecuali :other adalah :value.',
    'present_with' => 'Isian :attribute harus ada ketika :values ada.',
    'present_with_all' => 'Isian :attribute harus ada ketika :values ada.',
    'prohibited' => 'Isian :attribute tidak boleh diisi.',
    'prohibited_if' => 'Isian :attribute tidak boleh diisi ketika :other adalah :value.',
    'prohibited_unless' => 'Isian :attribute tidak boleh diisi kecuali :other ada dalam :values.',
    'prohibits' => 'Isian :attribute melarang :other untuk diisi.',
    'regex' => 'Format :attribute tidak valid.',
    'required' => 'Isian :attribute wajib diisi.',
    'required_array_keys' => 'Isian :attribute harus berisi entri untuk: :values.',
    'required_if' => 'Isian :attribute wajib diisi ketika :other adalah :value.',
    'required_if_accepted' => 'Isian :attribute wajib diisi ketika :other diterima.',
    'required_unless' => 'Isian :attribute wajib diisi kecuali :other ada dalam :values.',
    'required_with' => 'Isian :attribute wajib diisi ketika :values ada.',
    'required_with_all' => 'Isian :attribute wajib diisi ketika :values ada.',
    'required_without' => 'Isian :attribute wajib diisi ketika :values tidak ada.',
    'required_without_all' => 'Isian :attribute wajib diisi ketika tidak ada :values yang ada.',
    'same' => 'Isian :attribute dan :other harus cocok.',
    'size' => [
        'array' => ':Attribute harus mengandung :size item.',
        'file' => ':Attribute harus :size kilobita.',
        'numeric' => ':Attribute harus :size.',
        'string' => ':Attribute harus :size karakter.',
    ],
    'starts_with' => ':Attribute harus diawali dengan salah satu dari: :values.',
    'string' => ':Attribute harus berupa string.',
    'timezone' => ':Attribute harus berupa zona waktu yang valid.',
    'unique' => ':Attribute sudah digunakan.',
    'uploaded' => ':Attribute gagal diunggah.',
    'uppercase' => ':Attribute harus berupa huruf besar.',
    'url' => ':Attribute harus berupa URL yang valid.',
    'ulid' => ':Attribute harus berupa ULID yang valid.',
    'uuid' => ':Attribute harus berupa UUID yang valid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines.
    |
    */

    'custom' => [
        'name' => [
            'required' => 'Nama wajib diisi.',
            'min' => 'Nama minimal :min karakter.',
        ],
        'email' => [
            'required' => 'Email wajib diisi.',
            'email' => 'Masukkan alamat email yang valid.',
            'unique' => 'Email ini sudah terdaftar.',
        ],
        'phone' => [
            'required' => 'Nomor telepon wajib diisi.',
            'digits' => 'Nomor telepon harus :digits digit.',
            'digits_between' => 'Nomor telepon harus antara :min dan :max digit.',
            'unique' => 'Nomor telepon ini sudah terdaftar.',
            'regex' => 'Nomor telepon harus diawali 013, 014, 016, 017, 018, atau 019.',
        ],
        'password' => [
            'required' => 'Kata sandi wajib diisi.',
            'min' => 'Kata sandi minimal :min karakter.',
            'confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'regex' => 'Kata sandi harus mengandung huruf besar, huruf kecil, dan karakter khusus.',
        ],
        'address' => [
            'required' => 'Alamat wajib diisi.',
            'min' => 'Alamat minimal :min karakter.',
        ],
        'payment_method' => [
            'required' => 'Pilih metode pembayaran.',
        ],
        'coupon_code' => [
            'exists' => 'Kode kupon tidak valid.',
        ],
        'password_confirmation' => [
            'required' => 'Konfirmasi kata sandi wajib diisi.',
        ],
        'note' => [
            'string' => 'Catatan harus berupa teks.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute placeholders
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email".
    |
    */

    'attributes' => [
        'name' => 'Nama',
        'email' => 'Email',
        'phone' => 'No. WhatsApp',
        'password' => 'Kata Sandi',
        'password_confirmation' => 'Konfirmasi Kata Sandi',
        'address' => 'Alamat',
        'note' => 'Catatan',
        'payment_method' => 'Metode Pembayaran',
        'coupon_code' => 'Kode Kupon',
        'message' => 'Pesan',
        'subject' => 'Subjek',
    ],
];
