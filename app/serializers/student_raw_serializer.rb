class StudentRawSerializer < ActiveModel::Serializer
  attributes  :id, :full_name, :is_debtor_or_has_fines
end
