class StudentSerializer < ActiveModel::Serializer
  attributes  :id, :id_number, :full_name, :phone, :age, :status, :status_text,
              :email, :license_type, :available_hours, :assigned_hours,
              :debtor, :total_fines, :total_fines_value, :is_debtor_or_has_fines

  has_many :action_logs

  def status
    Student.statuses[object.status]
  end
end
